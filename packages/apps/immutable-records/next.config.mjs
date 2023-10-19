import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/react-ui'],
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default withVanillaExtract(nextConfig);
