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
        destination: 'https://api.testnet.kadindexer.io/v0',
      },
    ];
  },
};

module.exports = withVanillaExtract(nextConfig);
