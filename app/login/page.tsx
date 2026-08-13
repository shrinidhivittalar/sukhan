import { redirect } from "next/navigation";
import { AuthShell } from "../auth-shell";
import { getServerSession } from "../lib/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; reset?: string }>;
}) {
  if (await getServerSession()) redirect("/");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your reading"
      footnote="Your session stays signed in for 30 days on this device."
    >
      <LoginForm
        justVerified={params.verified === "1"}
        justReset={params.reset === "1"}
      />
    </AuthShell>
  );
}
