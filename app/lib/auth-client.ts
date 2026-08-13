"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_AUTH_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_AUTH_URL is not set. Point it at the Render auth server, e.g. http://localhost:3001",
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
