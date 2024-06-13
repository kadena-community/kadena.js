const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@kadena/react-ui'],
    env: {
    GRAPH_HOST: process.env.GRAPH_HOST,
    
    // Preperation for when the dropdown actually does something.
    KADENA_DEVNET_GRAPH: process.env.KADENA_DEVNET_GRAPH,
    KADENA_TESTNET_GRAPH: process.env.KADENA_TESTNET_GRAPH,
    KADENA_MAINNET_GRAPH: process.env.KADENA_MAINNET_GRAPH,
  },
};

module.exports = withVanillaExtract(nextConfig);
