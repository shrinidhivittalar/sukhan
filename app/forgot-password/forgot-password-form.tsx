"use client";

import { ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "../lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return setError("Enter a valid email address.");
    }

    setPending(true);
    await requestPasswordReset({
      email: cleanEmail,
      redirectTo: "/reset-password",
    });
    setPending(false);

    // Always report success: the response must not reveal whether the address
    // is registered.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="auth-confirmation">
        <MailCheck size={38} strokeWidth={1.6} />
        <h3>Check your inbox</h3>
        <p>
          If an account exists for <strong>{email.trim().toLowerCase()}</strong>, a reset link is
          on its way.
        </p>
        <p className="auth-confirmation-note">
          The link expires in an hour. Remember to look in your spam folder.
        </p>
        <Link className="primary-button login-button" href="/login">
          Back to sign in <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <>
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

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button login-button" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"} <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </>
  );
}
