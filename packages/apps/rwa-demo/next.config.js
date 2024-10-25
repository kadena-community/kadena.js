const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/kode-ui'],
  env: {},
  async redirects() {
    return [];
  },
};

module.exports = withVanillaExtract(nextConfig);
