import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@kadena/react-ui'],
  webpack: (config) => {
    config.optimization.splitChunks = false;
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/ipfs/:path*/image',
        destination: `https://:path*.ipfs.nftstorage.link/image`,
      },
      {
        source: '/api/ipfs/:path*/metadata',
        destination: `https://:path*.ipfs.nftstorage.link/metadata`,
      },
      {
        source: '/graph',
        destination:
          process.env.NEXT_PUBLIC_GRAHQLURL ??
          'https://graph.testnet.kadena.network/graphql',
      },
    ];
  },
};

export default withVanillaExtract(nextConfig);
