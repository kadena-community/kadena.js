const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_BUILD_TIME: new Date().toUTCString(),
  },
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@kadena/kode-ui'],
};

const configWithSentry = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  disableLogger: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  automaticVercelMonitors: true,
  tunnelRoute: '/monitoring',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
});

module.exports = withVanillaExtract(configWithSentry);
