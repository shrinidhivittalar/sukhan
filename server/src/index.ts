import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { auth, pool } from "./auth.js";
import { allowedOrigins, env } from "./env.js";
import { verifyMailer } from "./mailer.js";

const app = express();

// Render terminates TLS at its edge; without this Express reports every
// request as insecure and refuses to emit `Secure` cookies.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / server-to-server calls arrive without an Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    maxAge: 86_400,
  }),
);

// A coarse network-level guard in front of better-auth's own per-route limits.
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/health", async (_request, response) => {
  try {
    await pool.query("select 1");
    response.json({ ok: true, service: "sukhan-auth", database: "up" });
  } catch (error) {
    response.status(503).json({ ok: false, error: (error as Error).message });
  }
});

// IMPORTANT: better-auth needs the raw request stream, so it must be mounted
// before express.json() ever touches the body.
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: "64kb" }));

app.use((request, response) => {
  // This server hosts only the auth API. A browser arriving anywhere else
  // followed a redirect meant for the frontend (typically /login after email
  // verification), so forward it rather than showing raw JSON.
  const isBrowserNavigation = request.method === "GET" && request.accepts("html");
  const pointsElsewhere = (() => {
    try {
      return new URL(env.appUrl).origin !== new URL(env.authUrl).origin;
    } catch {
      return false;
    }
  })();

  if (isBrowserNavigation && pointsElsewhere) {
    return response.redirect(302, new URL(request.originalUrl, env.appUrl).toString());
  }

  response.status(404).json({ error: "Not found" });
});

app.use(
  (
    error: Error,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[server]", error);
    const isCors = error.message.includes("is not allowed");
    response
      .status(isCors ? 403 : 500)
      .json({ error: isCors ? error.message : "Internal server error" });
  },
);

const server = app.listen(env.port, () => {
  console.log(`[server] Sukhan auth listening on :${env.port}`);
  console.log(`[server] baseURL   ${env.authUrl}`);
  console.log(`[server] app       ${env.appUrl}`);
  console.log(`[server] origins   ${allowedOrigins.join(", ") || "(none)"}`);
  void verifyMailer();
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => {
      void pool.end().then(() => process.exit(0));
    });
  });
}
