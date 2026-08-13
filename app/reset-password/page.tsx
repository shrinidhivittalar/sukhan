import { AuthShell } from "../auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      footnote="Signing in elsewhere is unaffected until you use the new password."
    >
      <ResetPasswordForm token={params.token ?? ""} linkError={params.error ?? ""} />
    </AuthShell>
  );
}
