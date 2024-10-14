import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@kadena/kode-ui'],
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
        source: '/api/ipfs/:id/:path/image',
        destination: `https://:id.ipfs.:path.link/image`,
      },
      {
        source: '/api/ipfs/:id/:path/metadata',
        destination: `https://:id.ipfs.:path.link/metadata`,
      },
      {
        source: '/pinata/:cid',
        destination: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN ?? 'https://ipfs.io'}/ipfs/:cid?pinataGatewayToken=${process.env.PINATA_GATEWAYTOKEN}`,
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
