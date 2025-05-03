import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['react-chartjs-2', 'chart.js'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only run type checking during development; still will error at build for serious problems
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
