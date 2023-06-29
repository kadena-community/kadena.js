/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

const config = {
  reactStrictMode: true,
  pageExtensions:
    process.env.NODE_ENV === 'production' ? ['(?<!(spec|test).)tsx'] : ['tsx'],
  transpilePackages: ['@kadena/react-ui'],
  env: {
    KADENA_API_TTIL: process.env.KADENA_API_TTIL,
    KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
    KADENA_MAINNET_NETWORKS: process.env.KADENA_MAINNET_NETWORKS,
    KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
    KADENA_TESTNET_NETWORKS: process.env.KADENA_TESTNET_NETWORKS,
    GAS_PRICE: process.env.GAS_PRICE,
    GAS_LIMIT: process.env.GAS_LIMIT,
    FAUCET_PUBLIC_KEY: process.env.FAUCET_PUBLIC_KEY,
    FAUCET_PRIVATE_KEY: process.env.FAUCET_PRIVATE_KEY,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(spec|test).*$/,
      loader: 'ignore-loader',
    });
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = withVanillaExtract(nextTranslate(config));
