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
   * CIDR ranges of proxies sitting in front of this server. Required for rate
   * limiting: X-Forwarded-For arrives as a chain ("client, edge"), and
   * better-auth refuses to trust a multi-hop header unless it knows which
   * hops to skip. Defaults to private ranges, which covers Render, Fly and
   * most container platforms whose edge is the only route to the container.
   */
  trustedProxies: list("TRUSTED_PROXIES").length > 0
    ? list("TRUSTED_PROXIES")
    : [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "::1/128",
        "fc00::/7",
      ],

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

/**
 * Managed hosts (Render, Fly, Vercel) block outbound SMTP, so leftover SMTP_*
 * variables must not be mistaken for working email. Treating them as usable
 * keeps verification switched on and locks every new account out behind a
 * message that can never be delivered. Opt back in with ALLOW_SMTP=true if
 * the host genuinely permits it.
 */
const smtpConfigured = Boolean(env.smtp.host && env.smtp.user);
const smtpUsable =
  smtpConfigured && (!isProduction || optional("ALLOW_SMTP", "").toLowerCase() === "true");

/**
 * Brevo issues two credentials and only the API key (xkeysib-) authenticates
 * against the HTTP API. Accepting the SMTP key would switch verification on
 * while delivery fails, creating accounts that can never sign in. Reject it
 * outright so the deployment degrades to no-verification instead.
 */
const brevoKeyUsable = env.brevoApiKey.startsWith("xkeysib-");

export const mailTransport: MailTransport = env.resendApiKey
  ? "resend"
  : brevoKeyUsable
    ? "brevo"
    : smtpUsable
      ? "smtp"
      : "none";

if (env.brevoApiKey && !brevoKeyUsable) {
  console.warn(
    "[mail] Ignoring BREVO_API_KEY: this is Brevo's SMTP key (xsmtpsib-...), " +
      "which only works over SMTP and cannot authenticate against the HTTP " +
      "API. Create an API key under SMTP & API > API Keys; it begins with " +
      "xkeysib-. Email features stay disabled until then.",
  );
}

if (smtpConfigured && !smtpUsable) {
  console.warn(
    "[mail] Ignoring SMTP_* in production because managed hosts block outbound " +
      "SMTP. Email features stay disabled. Set BREVO_API_KEY or RESEND_API_KEY " +
      "to enable them, or ALLOW_SMTP=true if this host really does allow SMTP.",
  );
}

/**
 * Verification and password reset both depend on delivering mail. With no
 * provider configured they cannot work, so verification is switched off and
 * new accounts are signed in directly. Adding an API key turns both back on
 * with no code change. REQUIRE_EMAIL_VERIFICATION can force either way.
 */
const verificationOverride = optional("REQUIRE_EMAIL_VERIFICATION", "").toLowerCase();
export const emailEnabled = mailTransport !== "none";
export const requireEmailVerification =
  verificationOverride === "true" ? true
  : verificationOverride === "false" ? false
  : emailEnabled;

if (!emailEnabled) {
  console.warn(
    "[mail] No email provider configured. Email verification and password " +
      "reset are DISABLED; new accounts are signed in immediately. Set " +
      "BREVO_API_KEY or RESEND_API_KEY to enable them (Render blocks SMTP).",
  );
}

if (requireEmailVerification && !emailEnabled) {
  throw new Error(
    "REQUIRE_EMAIL_VERIFICATION=true but no email provider is configured, so " +
      "nobody could ever verify and sign in. Set BREVO_API_KEY or RESEND_API_KEY.",
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

/**
 * Shared hosting domains are on the Public Suffix List, so a browser refuses a
 * cookie scoped to them: every customer of the platform would otherwise be able
 * to set cookies for every other. The refusal is silent, which presents as a
 * login that appears to succeed and then bounces straight back to the sign-in
 * page. Nothing works with such a value, so refuse to start rather than serve a
 * deployment where nobody can stay signed in.
 */
const PUBLIC_SUFFIXES = [
  "vercel.app",
  "onrender.com",
  "netlify.app",
  "herokuapp.com",
  "pages.dev",
  "fly.dev",
  "railway.app",
  "github.io",
];

if (env.cookieDomain) {
  const bare = env.cookieDomain.replace(/^\./, "").toLowerCase();
  const suffix = PUBLIC_SUFFIXES.find((entry) => bare === entry);
  if (suffix) {
    throw new Error(
      `COOKIE_DOMAIN is set to "${env.cookieDomain}", but ${suffix} is a shared ` +
        "platform domain that browsers will not accept a cookie for, so no one " +
        "could stay signed in. Remove COOKIE_DOMAIN and set AUTH_PROXIED=true so " +
        "the frontend proxies /api/auth/* and the cookie stays first-party. " +
        "COOKIE_DOMAIN is only for a custom domain you own, e.g. .example.com.",
    );
  }
}

if (isProduction && !env.cookieDomain && !env.proxied) {
  console.warn(
    "[auth] COOKIE_DOMAIN is not set and AUTH_PROXIED is not enabled, so the " +
      "browser will discard the session cookie and logins will not persist. " +
      "Either set AUTH_PROXIED=true (correct on Vercel + Render), or, on a custom " +
      "domain you own, set COOKIE_DOMAIN=.yourdomain.com.",
  );
}

export const allowedOrigins = Array.from(
  new Set([env.appUrl, ...env.trustedOrigins].filter(Boolean)),
);
