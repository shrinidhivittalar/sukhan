"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authErrorMessage, sendVerificationEmail, signIn } from "../lib/auth-client";
import { PasswordField } from "../password-field";

export function LoginForm({
  justVerified,
  justReset,
  emailEnabled,
}: {
  justVerified: boolean;
  justReset: boolean;
  emailEnabled: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setUnverified(false);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPending(true);
    const { error: signInError } = await signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });
    setPending(false);

    if (signInError) {
      if (signInError.status === 403) {
        // Offering to resend without a provider would promise a mail that never
        // sends; without one there is nothing the user can do but ask an admin.
        setUnverified(emailEnabled);
        setError(
          emailEnabled
            ? "Confirm your email before signing in."
            : "This account is not activated. Please contact support.",
        );
        return;
      }
      // Deliberately generic: never reveal whether the address exists.
      setError(
        signInError.status === 401
          ? "That email and password do not match."
          : authErrorMessage(signInError, "Could not sign in. Please try again."),
      );
      return;
    }

    router.push("/");
    router.refresh();
  };

  const resend = async () => {
    setPending(true);
    await sendVerificationEmail({
      email: email.trim().toLowerCase(),
      callbackURL: "/login?verified=1",
    });
    setPending(false);
    setUnverified(false);
    setError("");
    setNotice("Verification email sent. Check your inbox.");
  };

  return (
    <>
      {justVerified && (
        <p className="form-success" role="status">
          Email confirmed. Sign in to begin.
        </p>
      )}
      {justReset && (
        <p className="form-success" role="status">
          Password updated. Sign in with your new password.
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          {notice}
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={pending}
          />
        </label>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Your password"
          disabled={pending}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
            {unverified && (
              <>
                {" "}
                <button type="button" className="inline-link" onClick={resend} disabled={pending}>
                  Resend the link
                </button>
              </>
            )}
          </p>
        )}

        <button className="primary-button login-button" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"} <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-links">
        {/* Reset needs an email provider; hide it rather than send users into
            a flow whose message can never arrive. */}
        {emailEnabled && <Link href="/forgot-password">Forgot your password?</Link>}
        <span>
          New here? <Link href="/signup">Create an account</Link>
        </span>
      </div>
    </>
  );
}
