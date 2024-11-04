import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/kode-ui'],
  async rewrites() {
    return [
      {
        source: '/pinata/:cid',
        destination: `https://gateway.pinata.cloud/ipfs/:cid`,
      },
      {
        source: '/graph',
        destination:
          process.env.NEXT_PUBLIC_GRAHQLURL ??
          'https://graph.kadena.network/graphql',
      },
    ];
  },
};

export default withVanillaExtract(nextConfig);
