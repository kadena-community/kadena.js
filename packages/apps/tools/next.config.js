const nextTranslate = require('@webpro/next-translate-plugin');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const config = {
  nextTranslate: { basePath: __dirname },
  eslint: {
    ignoreDuringBuilds: true, // lint is a different task/phase
  },
  reactStrictMode: false,
  transpilePackages: ['@kadena/kode-ui'],
  env: {
    KADENA_API_TTIL: process.env.KADENA_API_TTIL,
    KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
    KADENA_MAINNET_NETWORKS: process.env.KADENA_MAINNET_NETWORKS,
    KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
    KADENA_TESTNET_NETWORKS: process.env.KADENA_TESTNET_NETWORKS,
    GAS_PRICE: process.env.GAS_PRICE,
    GAS_LIMIT: process.env.GAS_LIMIT,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
    WALLET_CONNECT_RELAY_URL: process.env.WALLET_CONNECT_RELAY_URL,
    FAUCET_NAMESPACE: process.env.FAUCET_NAMESPACE,
    FAUCET_CONTRACT: process.env.FAUCET_CONTRACT,
    FAUCET_USER: process.env.FAUCET_USER,
    QA_LEDGER_MOCK: process.env.QA_LEDGER_MOCK,
    QA_LEDGER_MOCKED_PUBKEY: process.env.QA_LEDGER_MOCKED_PUBKEY,
    QA_LEDGER_MOCKED_PRIVATEKEY: process.env.QA_LEDGER_MOCKED_PRIVATEKEY,
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_BUILD_TIME: new Date().toUTCString(),
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,

      fs: false, // Fixes npm packages that depend on `fs` module
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/eth/:path*',
        destination: `${process.env.NEXT_PUBLIC_EVMRPC_URL ?? 'http://localhost:8545/chain/'}:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/transactions/module-explorer',
        destination: '/modules/explorer',
        permanent: true,
      },
      {
        source: '/transfer-ledger-create.html',
        destination: '/transactions/transfer',
        permanent: true,
      },
      {
        source: '/transfer-ledger-create',
        destination: '/transactions/transfer',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/faucet',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/api/graph',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

module.exports = withVanillaExtract(nextTranslate(config));
