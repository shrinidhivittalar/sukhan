"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authErrorMessage, resetPassword } from "../lib/auth-client";
import { MIN_PASSWORD_LENGTH, PasswordField, passwordProblem } from "../password-field";

export function ResetPasswordForm({
  token,
  linkError,
}: {
  token: string;
  linkError: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // better-auth redirects here with ?error=INVALID_TOKEN when the link is stale.
  if (!token || linkError) {
    return (
      <div className="auth-confirmation">
        <TriangleAlert size={38} strokeWidth={1.6} />
        <h3>This link is no longer valid</h3>
        <p>
          Reset links expire after an hour and work only once. Request a fresh one to continue.
        </p>
        <Link className="primary-button login-button" href="/forgot-password">
          Request a new link <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("The two passwords do not match.");

    setPending(true);
    const { error: resetError } = await resetPassword({ newPassword: password, token });
    setPending(false);

    if (resetError) {
      setError(
        authErrorMessage(
          resetError,
          "That link has expired. Request a new one from the sign-in page.",
        ),
      );
      return;
    }

    router.push("/login?reset=1");
  };

  return (
    <>
      <form onSubmit={submit} noValidate>
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={pending}
          hint={`Minimum ${MIN_PASSWORD_LENGTH} characters.`}
        />

        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          placeholder="Repeat your new password"
          disabled={pending}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button login-button" type="submit" disabled={pending}>
          {pending ? "Updating…" : "Update password"} <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </>
  );
}
