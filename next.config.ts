import type { NextConfig } from "next";

/** Origin of the auth server (Render). Server-side only. */
const authOrigin = process.env.AUTH_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // This project sits inside a parent folder that also has a lockfile; pin the
  // root so Next does not infer the wrong workspace.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async rewrites() {
    if (!authOrigin) return [];
    // Serve the auth API from this app's own origin. The browser only ever
    // talks to the Vercel domain, so the session cookie it receives is
    // first-party and is not subject to cross-site cookie blocking. Without
    // this, a cookie issued by onrender.com would never be sent back to a
    // page on vercel.app.
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authOrigin}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
