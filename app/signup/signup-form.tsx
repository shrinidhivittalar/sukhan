"use client";

import { ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authErrorMessage, signUp } from "../lib/auth-client";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PasswordField,
  passwordProblem,
} from "../password-field";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return setError("Enter a valid email address.");
    }
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("The two passwords do not match.");

    setPending(true);
    const { data, error: signUpError } = await signUp.email({
      name: cleanName,
      email: cleanEmail,
      password,
      callbackURL: "/login?verified=1",
    });
    setPending(false);

    if (!signUpError && data?.token) {
      // Verification is disabled on this deployment, so the account is already
      // in a session. Skip the "check your inbox" screen entirely.
      router.push("/");
      router.refresh();
      return;
    }

    if (signUpError) {
      setError(
        signUpError.status === 422
          ? "An account with that email already exists."
          : authErrorMessage(signUpError, "Could not create the account. Please try again."),
      );
      return;
    }

    setSentTo(cleanEmail);
  };

  if (sentTo) {
    return (
      <div className="auth-confirmation">
        <MailCheck size={38} strokeWidth={1.6} />
        <h3>Check your inbox</h3>
        <p>
          We sent a confirmation link to <strong>{sentTo}</strong>. Open it to activate your
          account, then sign in.
        </p>
        <p className="auth-confirmation-note">
          The link expires in an hour. If it does not arrive, check your spam folder.
        </p>
        <Link className="primary-button login-button" href="/login">
          Go to sign in <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} noValidate>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Your name"
            disabled={pending}
          />
        </label>

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={pending}
          showStrength
          hint={`Between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`}
        />

        <PasswordField
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          placeholder="Repeat your password"
          disabled={pending}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button login-button" type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"} <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-links">
        <span>
          Already have an account? <Link href="/login">Sign in</Link>
        </span>
      </div>
    </>
  );
}
