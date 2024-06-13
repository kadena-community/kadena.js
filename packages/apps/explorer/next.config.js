const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@kadena/react-ui'],
    env: {
    KADENA_GRAPH_HOST: process.env.KADENA_GRAPH_HOST,
  },
};

module.exports = withVanillaExtract(nextConfig);
