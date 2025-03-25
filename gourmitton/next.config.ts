import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      }
    ],
    domains: ['gourmet.cours.quimerch.com'],
    formats : ['image/avif', 'image/webp'],
  },
};

export default nextConfig;