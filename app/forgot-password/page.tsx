import { redirect } from "next/navigation";
import { AuthShell } from "../auth-shell";
import { getAuthConfig } from "../lib/config";
import { ForgotPasswordForm } from "./forgot-password-form";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  // The link into this page is already hidden without an email provider, but a
  // bookmark or a typed URL would otherwise reach a form whose message can
  // never be sent.
  const { emailEnabled } = await getAuthConfig();
  if (!emailEnabled) redirect("/login");

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      footnote="The reset link expires in one hour and can be used once."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
