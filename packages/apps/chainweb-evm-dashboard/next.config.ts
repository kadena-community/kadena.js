const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@kadena/kode-ui'],
  env: {
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_BUILD_TIME: new Date().toUTCString(),
  },
};

export default withVanillaExtract(nextConfig);
