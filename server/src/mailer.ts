import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  // 465 is implicit TLS; 587 upgrades via STARTTLS.
  secure: env.smtp.port === 465,
  auth: { user: env.smtp.user, pass: env.smtp.pass },
});

export async function verifySmtp(): Promise<void> {
  try {
    await transporter.verify();
    console.log(`[mail] SMTP ready via ${env.smtp.host}:${env.smtp.port}`);
  } catch (error) {
    console.error("[mail] SMTP connection failed:", (error as Error).message);
  }
}

type TemplateOptions = {
  heading: string;
  intro: string;
  buttonLabel: string;
  url: string;
  footnote: string;
};

function render({ heading, intro, buttonLabel, url, footnote }: TemplateOptions): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#f4f1e9;font-family:Georgia,'Times New Roman',serif;color:#18201e;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fffef9;border:1px solid #d6d8d0;border-radius:6px;">
      <tr>
        <td style="padding:32px 36px 8px;">
          <div style="font-size:26px;color:#23625d;direction:rtl;">&#1587;&#1582;&#1606;</div>
          <div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#4d5b57;font-family:Arial,Helvetica,sans-serif;margin-top:6px;">Sukhan &middot; Urdu Poetry Studio</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 36px 0;">
          <h1 style="margin:0 0 14px;font-size:27px;font-weight:500;line-height:1.2;">${heading}</h1>
          <p style="margin:0 0 26px;font-size:16px;line-height:1.55;color:#4d5b57;">${intro}</p>
          <a href="${url}" style="display:inline-block;background:#2f7f78;color:#fffef9;text-decoration:none;padding:14px 26px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${buttonLabel}</a>
          <p style="margin:26px 0 0;font-size:13px;line-height:1.5;color:#7b8582;font-family:Arial,Helvetica,sans-serif;">Or paste this link into your browser:<br><span style="color:#23625d;word-break:break-all;">${url}</span></p>
        </td>
      </tr>
      <tr>
        <td style="padding:22px 36px 30px;">
          <hr style="border:none;border-top:1px solid #e9ede8;margin:0 0 16px;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#7b8582;font-family:Arial,Helvetica,sans-serif;">${footnote}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function send(to: string, subject: string, html: string, text: string) {
  await transporter.sendMail({
    from: `"Sukhan" <${env.smtp.from}>`,
    to,
    subject,
    text,
    html,
  });
}

export async function sendVerificationEmail(to: string, url: string) {
  await send(
    to,
    "Confirm your email · Sukhan",
    render({
      heading: "Confirm your email",
      intro:
        "Verify this address to open your Sukhan account and begin the ten-volume reading path.",
      buttonLabel: "Verify email",
      url,
      footnote:
        "This link expires in 1 hour. If you did not create a Sukhan account, you can ignore this message.",
    }),
    `Confirm your email for Sukhan:\n${url}\n\nThis link expires in 1 hour.`,
  );
}

export async function sendResetPasswordEmail(to: string, url: string) {
  await send(
    to,
    "Reset your password · Sukhan",
    render({
      heading: "Reset your password",
      intro:
        "We received a request to reset the password for your Sukhan account. Choose a new one below.",
      buttonLabel: "Choose a new password",
      url,
      footnote:
        "This link expires in 1 hour and can be used once. If you did not request a reset, your password is unchanged and no action is needed.",
    }),
    `Reset your Sukhan password:\n${url}\n\nThis link expires in 1 hour.`,
  );
}
