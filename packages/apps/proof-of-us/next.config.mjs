import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // lint is a different task/phase
  },

  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  reactStrictMode: true,
};

export default withVanillaExtract(nextConfig);
