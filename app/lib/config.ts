import "server-only";

export type AuthConfig = {
  /** False when no email provider is configured on the auth server. */
  emailEnabled: boolean;
  requireEmailVerification: boolean;
};

const authUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_AUTH_URL;

/**
 * Asks the auth server which flows this deployment supports, so the UI does not
 * offer a password reset that can never arrive.
 *
 * Falls back to email being OFF. A free-tier auth server sleeps and can take
 * longer than the timeout to wake, and assuming email worked in that window put
 * a reset link and a "confirm your email" screen in front of users on a
 * deployment that could deliver neither. Hiding a flow that does work is a far
 * cheaper mistake than offering one that cannot.
 */
export async function getAuthConfig(): Promise<AuthConfig> {
  const fallback: AuthConfig = { emailEnabled: false, requireEmailVerification: false };
  if (!authUrl) return fallback;

  try {
    const response = await fetch(`${authUrl}/config`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return fallback;
    return (await response.json()) as AuthConfig;
  } catch {
    return fallback;
  }
}
