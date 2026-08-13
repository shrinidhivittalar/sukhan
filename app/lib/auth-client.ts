"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL ?? "";

// This module is imported by prerendered pages, so a missing value must not
// throw at import time or it fails the production build instead of surfacing
// as a configuration problem. Complain loudly in the browser instead.
if (!baseURL && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_AUTH_URL is not set. Authentication requests will fail. " +
      "Point it at the auth server, e.g. https://auth.yourdomain.com",
  );
}

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    // The auth server is a different origin, so the session cookie only rides
    // along when credentials are explicitly included.
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient;

/** Normalises better-auth error payloads into something safe to render. */
export function authErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
