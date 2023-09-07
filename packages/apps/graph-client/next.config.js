const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@kadena/react-ui'],
  async rewrites() {
    return [
      {
        source: '/graph',
        destination: 'http://localhost:4000/graphql',
      },
    ];
  },
};

module.exports = withVanillaExtract(nextConfig);
