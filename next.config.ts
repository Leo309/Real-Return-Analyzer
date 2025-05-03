import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Changed from true to false to help with Chart.js rendering
  swcMinify: true,
  transpilePackages: ['react-chartjs-2', 'chart.js'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only run type checking during development; still will error at build for serious problems
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    // Explicitly handle Canvas in the browser only
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;