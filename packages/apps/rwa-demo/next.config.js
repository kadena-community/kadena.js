const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
