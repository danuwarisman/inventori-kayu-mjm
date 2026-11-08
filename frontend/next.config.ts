import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy same-origin ke backend NestJS supaya API tidak bergantung pada
    // IP/host tempat frontend dibuka (Tailscale, tunnel, localhost, dsb).
    //
    // Prioritas target backend:
    // 1. process.env.INTERNAL_API_URL (dari environment, .env.local, atau Docker Compose)
    // 2. Jika dev lokal: default ke tunnel backend aktif (http://127.0.0.1:8080/api-proxy)
    // 3. Jika production (Docker Compose): default ke service container http://backend:3001
    const defaultTarget =
      process.env.NODE_ENV === "production"
        ? "http://backend:3001"
        : "http://127.0.0.1:8080/api-proxy";

    const targetUrl = process.env.INTERNAL_API_URL || defaultTarget;

    return [
      {
        source: "/api-proxy/:path*",
        destination: `${targetUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
