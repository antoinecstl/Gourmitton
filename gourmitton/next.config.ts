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
    formats : ['image/avif', 'image/webp'],
  },
  
  webpack: (config, { isServer }) => {
    // Only apply to client bundles
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](@vercel\/analytics|react|react-dom|scheduler|next|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            minChunks: 2,
          },
        },
      };
    }
    
    // Return the modified config
    return config;
  }
};

export default nextConfig;