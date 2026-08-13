import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy server/.env.example to server/.env and fill it in.`,
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

function list(name: string): string[] {
  return optional(name, "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const isProduction = process.env.NODE_ENV === "production";

export const env = {
  isProduction,
  port: Number(optional("PORT", "3001")),

  databaseUrl: required("DATABASE_URL"),

  authSecret: required("BETTER_AUTH_SECRET"),
  /** Public origin of THIS auth server, e.g. https://auth.yourdomain.com */
  authUrl: required("BETTER_AUTH_URL"),
  /** Public origin of the Next.js app, e.g. https://sukhan.yourdomain.com */
  appUrl: required("APP_URL"),
  /**
   * Parent domain the session cookie is scoped to, e.g. `.yourdomain.com`.
   * Required in production so the Vercel-hosted frontend receives the cookie
   * that this Render-hosted server issues. Leave unset in local development.
   */
  cookieDomain: optional("COOKIE_DOMAIN", ""),

  /** Extra browser origins allowed to call this server with credentials. */
  trustedOrigins: list("TRUSTED_ORIGINS"),

  /**
   * True when the frontend proxies /api/auth/* through to this server, so the
   * browser only ever sees the app's own origin. That makes the session cookie
   * same-site and removes the need for a shared parent domain.
   */
  proxied: optional("AUTH_PROXIED", "").toLowerCase() === "true",

  /**
   * Render blocks outbound SMTP (ports 25/465/587), so production sends over
   * an HTTPS email API instead. SMTP stays available for local development.
   */
  resendApiKey: optional("RESEND_API_KEY", ""),
  brevoApiKey: optional("BREVO_API_KEY", ""),

  mailFrom: optional("MAIL_FROM", process.env.SMTP_FROM ?? process.env.SMTP_USER ?? ""),

  smtp: {
    host: optional("SMTP_HOST", ""),
    port: Number(optional("SMTP_PORT", "587")),
    user: optional("SMTP_USER", ""),
    pass: optional("SMTP_PASS", ""),
    from: optional("SMTP_FROM", process.env.SMTP_USER ?? ""),
  },
} as const;

export type MailTransport = "resend" | "brevo" | "smtp" | "none";

export const mailTransport: MailTransport = env.resendApiKey
  ? "resend"
  : env.brevoApiKey
    ? "brevo"
    : env.smtp.host && env.smtp.user
      ? "smtp"
      : "none";

if (mailTransport === "none") {
  console.warn(
    "[mail] No email provider configured. Set RESEND_API_KEY or BREVO_API_KEY " +
      "(required on Render, which blocks SMTP), or SMTP_* for local development.",
  );
}

if (isProduction && mailTransport === "smtp") {
  console.warn(
    "[mail] Using SMTP in production. Render blocks outbound SMTP ports, so " +
      "verification and password-reset emails will time out there. Set " +
      "RESEND_API_KEY or BREVO_API_KEY instead.",
  );
}

if (isProduction) {
  const problems: string[] = [];

  if (/\/\/(localhost|127\.0\.0\.1)/.test(env.appUrl)) {
    problems.push(`APP_URL still points at localhost (${env.appUrl}).`);
  }
  if (/\/\/(localhost|127\.0\.0\.1)/.test(env.authUrl)) {
    problems.push(`BETTER_AUTH_URL still points at localhost (${env.authUrl}).`);
  }
  try {
    // When proxied the two are *expected* to match: the browser reaches auth
    // through the app's own origin.
    if (!env.proxied && new URL(env.appUrl).origin === new URL(env.authUrl).origin) {
      problems.push(
        "APP_URL and BETTER_AUTH_URL are the same origin. APP_URL must be the " +
          "frontend (the site with the /login page), not this auth server. " +
          "Leaving them equal makes post-verification redirects land here and " +
          "return 404. (If the frontend proxies /api/auth/*, set AUTH_PROXIED=true.)",
      );
    }
  } catch {
    problems.push("APP_URL or BETTER_AUTH_URL is not a valid absolute URL.");
  }

  if (problems.length > 0) {
    throw new Error(
      `Refusing to start with a broken configuration:\n  - ${problems.join("\n  - ")}`,
    );
  }
}

if (isProduction && !env.cookieDomain) {
  console.warn(
    "[auth] COOKIE_DOMAIN is not set. In production the frontend and this server " +
      "must share a parent domain (e.g. sukhan.example.com + auth.example.com with " +
      "COOKIE_DOMAIN=.example.com), otherwise the browser will discard the session cookie.",
  );
}

export const allowedOrigins = Array.from(
  new Set([env.appUrl, ...env.trustedOrigins].filter(Boolean)),
);
