// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // match any subdomain of convex.cloud
        hostname: "**.convex.cloud",
        // only allow paths under /api/storage/
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;

