import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy same-origin ke backend NestJS supaya API tidak bergantung pada
        // IP/host tempat frontend dibuka (Tailscale, tunnel, localhost, dsb).
        // Default cocok untuk Docker Compose (service "backend"). Saat dev di
        // luar Compose, set INTERNAL_API_URL=http://localhost:3001.
        source: "/api-proxy/:path*",
        destination: `${process.env.INTERNAL_API_URL ?? "http://backend:3001"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
