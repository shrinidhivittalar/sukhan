import { redirect } from "next/navigation";
import { AuthShell } from "../auth-shell";
import { getAuthConfig } from "../lib/config";
import { getServerSession } from "../lib/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; reset?: string }>;
}) {
  if (await getServerSession()) redirect("/");
  const [params, config] = await Promise.all([searchParams, getAuthConfig()]);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your reading"
      footnote="Your session stays signed in for 30 days on this device."
    >
      <LoginForm
        justVerified={params.verified === "1"}
        justReset={params.reset === "1"}
        emailEnabled={config.emailEnabled}
      />
    </AuthShell>
  );
}
