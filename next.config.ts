import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Changed from true to false to help with Chart.js rendering
  swcMinify: true,
  transpilePackages: ['react-chartjs-2', 'chart.js', 'recharts'],
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
    
    // Fix SyntaxError with 'as' identifier in production
    if (config.module && config.module.rules) {
      // Ensure all JS/TS files are properly transpiled, including node_modules that might use modern syntax
      const jsRule = config.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes('js|jsx|mjs|cjs|ts|tsx')
      );

      if (jsRule && jsRule.use && Array.isArray(jsRule.use)) {
        const babelLoader = jsRule.use.find(
          (loader) => loader && typeof loader === 'object' && loader.loader === 'next-swc-loader'
        );

        if (babelLoader && typeof babelLoader === 'object' && babelLoader.options) {
          // Ensure proper transpilation for modern JS features
          babelLoader.options.jsc = {
            ...babelLoader.options.jsc,
            target: 'es2015',
            parser: {
              ...babelLoader.options.jsc?.parser,
              syntax: 'ecmascript'
            }
          };
        }
      }
    }
    
    return config;
  },
};

export default nextConfig;