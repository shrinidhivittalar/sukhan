import { AuthShell } from "../auth-shell";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
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
