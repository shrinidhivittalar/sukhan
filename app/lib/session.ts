import "server-only";
import { headers } from "next/headers";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
};

export type ServerSession = {
  user: SessionUser;
  session: { id: string; expiresAt: string };
};

/** Server-side origin of the auth service. Falls back to the public value. */
const authUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_AUTH_URL;

/**
 * Validates the incoming request's session against the auth server.
 *
 * The cookie is issued by the auth origin (Render) and reaches this Next.js
 * server (Vercel) only because both share a parent domain in production; we
 * forward it verbatim so the auth server remains the single source of truth.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  if (!authUrl) return null;

  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;

  try {
    const response = await fetch(`${authUrl}/api/auth/get-session`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const text = await response.text();
    if (!text) return null;

    const data = JSON.parse(text) as ServerSession | null;
    return data?.user ? data : null;
  } catch {
    // A cold Render instance or a network blip must not hard-crash the page;
    // callers treat null as "not signed in" and redirect to /login.
    return null;
  }
}
