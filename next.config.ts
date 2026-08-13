import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits inside a parent folder that also has a lockfile; pin the
  // root so Next does not infer the wrong workspace.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default nextConfig;
