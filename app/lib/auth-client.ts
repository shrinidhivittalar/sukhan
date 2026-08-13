"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Left unset by default, so requests go to this app's own origin and are
 * rewritten to the auth server by `next.config.ts`. That keeps the session
 * cookie first-party. Set NEXT_PUBLIC_AUTH_URL only when calling the auth
 * server directly on a shared parent domain.
 */
const baseURL = process.env.NEXT_PUBLIC_AUTH_URL?.trim() || undefined;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    // Required either way: same-origin through the proxy, and cross-origin
    // when talking to the auth host directly.
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
