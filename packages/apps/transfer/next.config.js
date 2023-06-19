/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  reactStrictMode: true,
  pageExtensions:
    process.env.NODE_ENV === 'production' ? ['(?<!(spec|test).)tsx'] : ['tsx'],
  env: {
    KADENA_API_TTIL: JSON.stringify(process.env.KADENA_API_TTIL),
    KADENA_MAINNET_API: JSON.stringify(process.env.KADENA_MAINNET_API),
    KADENA_MAINNET_NETWORKS: JSON.stringify(
      process.env.KADENA_MAINNET_NETWORKS,
    ),
    KADENA_TESTNET_API: JSON.stringify(process.env.KADENA_TESTNET_API),
    KADENA_TESTNET_NETWORKS: JSON.stringify(
      process.env.KADENA_TESTNET_NETWORKS,
    ),
    GAS_PRICE: JSON.stringify(process.env.GAS_PRICE),
    GAS_LIMIT: JSON.stringify(process.env.GAS_LIMIT),
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
});
