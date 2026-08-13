import { redirect } from "next/navigation";
import { AuthShell } from "../auth-shell";
import { getServerSession } from "../lib/session";
import { SignupForm } from "./signup-form";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getServerSession()) redirect("/");

  return (
    <AuthShell
      eyebrow="Begin the path"
      title="Create your account"
      footnote="We send one confirmation email. Nothing else."
    >
      <SignupForm />
    </AuthShell>
  );
}
