import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { allowedOrigins, env } from "./env.js";
import { sendResetPasswordEmail, sendVerificationEmail } from "./mailer.js";

export const pool = new Pool({
  connectionString: env.databaseUrl,
  // Neon's pooled endpoint terminates TLS with a certificate chain that Node
  // does not bundle; sslmode=require in the URL still encrypts the connection.
  ssl: env.databaseUrl.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

/**
 * Guarantee the post-action redirect lands on the frontend rather than on this
 * API host, even if a client forgets to pass `callbackURL` / `redirectTo`.
 */
function ensureCallback(rawUrl: string, fallbackPath: string): string {
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.get("callbackURL")) {
      url.searchParams.set("callbackURL", new URL(fallbackPath, env.appUrl).toString());
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export const auth = betterAuth({
  appName: "Sukhan",
  secret: env.authSecret,
  baseURL: env.authUrl,
  basePath: "/api/auth",
  database: pool,

  trustedOrigins: allowedOrigins,

  // The Neon database already carries a snake_case better-auth schema. Map the
  // camelCase model fields onto it rather than migrating live columns.
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      userId: "user_id",
    },
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the expiry at most once a day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min signed cache to avoid a DB read on every request
    },
    freshAge: 60 * 60 * 24, // re-auth window for sensitive operations
  },
  account: {
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      userId: "user_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    accountLinking: { enabled: true, trustedProviders: ["email-password"] },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, ensureCallback(url, "/reset-password"));
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, ensureCallback(url, "/login?verified=1"));
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    // Persisted so limits survive Render restarts and hold across instances.
    storage: "database",
    modelName: "rate_limit",
    fields: { lastRequest: "last_request" },
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60 * 60, max: 6 },
      "/request-password-reset": { window: 60 * 60, max: 5 },
      "/forget-password": { window: 60 * 60, max: 5 },
      "/reset-password": { window: 60 * 60, max: 8 },
      "/send-verification-email": { window: 60 * 60, max: 5 },
    },
  },

  advanced: {
    // Render terminates TLS at its edge and forwards the caller in
    // X-Forwarded-For. Without this the rate limiter cannot tell clients
    // apart and degrades to one shared bucket for everyone.
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
    // The frontend (Vercel) and this server (Render) are different hosts, so
    // the session cookie has to be readable across the shared parent domain.
    // Locally both sides are `localhost` (cookies ignore ports), so the
    // cross-subdomain machinery is only switched on in production.
    crossSubDomainCookies: env.isProduction && env.cookieDomain
      ? { enabled: true, domain: env.cookieDomain }
      : { enabled: false },
    defaultCookieAttributes: env.isProduction
      ? { sameSite: "none", secure: true, httpOnly: true, partitioned: true }
      : { sameSite: "lax", secure: false, httpOnly: true },
    useSecureCookies: env.isProduction,
    cookiePrefix: "sukhan",
  },
});

export type Session = typeof auth.$Infer.Session;
