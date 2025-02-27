const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverSourceMaps: false,
    webpackBuildWorker: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['@kadena/kode-ui'],
  async rewrites() {
    return [
      {
        source: '/graph',
        destination:
          process.env.NEXT_PUBLIC_GRAPHURL ?? 'http://localhost:8080/graphql',
      },
    ];
  },
};

module.exports = withVanillaExtract(nextConfig);
