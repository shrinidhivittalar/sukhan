/**
 * Standalone Brevo check. Deliberately does not import ./env.js, which requires
 * DATABASE_URL and the auth secrets: this must run with nothing but a key and a
 * sender, so a mail problem can be diagnosed without a working database.
 *
 *   npm run mail:test -- you@example.com
 */
import "dotenv/config";

const key = process.env.BREVO_API_KEY?.trim() ?? "";
const from = (process.env.MAIL_FROM ?? process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "").trim();
const to = process.argv[2]?.trim();

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

if (!to) fail("Pass a recipient: npm run mail:test -- you@example.com");
if (!key) fail("BREVO_API_KEY is not set in server/.env");
if (!from) fail("MAIL_FROM is not set in server/.env (must be a sender verified in Brevo)");

if (key.startsWith("xsmtpsib-")) {
  fail(
    "That is Brevo's SMTP key, which cannot authenticate against the HTTP API.\n" +
      "  Create one under SMTP & API > API Keys; it begins with xkeysib-.",
  );
}
if (!key.startsWith("xkeysib-")) {
  console.warn(`! Key starts with "${key.slice(0, 10)}...", expected xkeysib- . Trying anyway.\n`);
}

console.log(`Sending as : ${from}`);
console.log(`Sending to : ${to}`);
console.log(`Key        : ${key.slice(0, 12)}...${key.slice(-4)}\n`);

// Confirms the key itself is valid and shows the plan, separating an auth
// problem from a sender or recipient problem before anything is sent.
const account = await fetch("https://api.brevo.com/v3/account", {
  headers: { "api-key": key },
});
const accountBody = await account.text();

if (!account.ok) {
  fail(
    `Brevo rejected the key (HTTP ${account.status}).\n  ${accountBody}\n\n` +
      "  401 here means the key is wrong, revoked, or copied with stray characters.",
  );
}
console.log(`✓ Key accepted by Brevo.\n  ${accountBody.slice(0, 400)}\n`);

const send = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: { "api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    sender: { name: "Sukhan", email: from },
    to: [{ email: to }],
    subject: "Sukhan mail test",
    htmlContent: "<p>If you are reading this, Brevo delivery works.</p>",
    textContent: "If you are reading this, Brevo delivery works.",
  }),
});
const sendBody = await send.text();

if (!send.ok) {
  fail(
    `Brevo refused the message (HTTP ${send.status}).\n  ${sendBody}\n\n` +
      "  A sender error means MAIL_FROM is not verified under Senders, Domains & " +
      "Dedicated IPs > Senders.",
  );
}

console.log(`✓ Brevo accepted the message.\n  ${sendBody}`);
console.log("\nCheck the inbox, and the spam folder. If it never arrives, open the");
console.log("Brevo dashboard under Transactional > Logs to see what happened to it.");
