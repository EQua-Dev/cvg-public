import type { NextConfig } from "next";

// Only the public, read-only part of the API is reachable through this site.
const API_URL = process.env.CVG_API_URL ?? "http://localhost:8080";

const config: NextConfig = {
  poweredByHeader: false,
  // Self-contained server for Docker; Vercel ignores this and uses its own build.
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/public/:path*", destination: `${API_URL}/api/public/:path*` }];
  },
};

export default config;
