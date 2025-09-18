import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  // Enable strict mode for better performance
  reactStrictMode: true,
  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
