import "server-only";

export type AuthConfig = {
  /** False when no email provider is configured on the auth server. */
  emailEnabled: boolean;
  requireEmailVerification: boolean;
};

const authUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_AUTH_URL;

/**
 * Asks the auth server which flows this deployment supports, so the UI does not
 * offer a password reset that can never arrive. Assumes email works if the
 * server cannot be reached, which keeps the normal deployment unchanged.
 */
export async function getAuthConfig(): Promise<AuthConfig> {
  const fallback: AuthConfig = { emailEnabled: true, requireEmailVerification: true };
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
