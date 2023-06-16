/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  reactStrictMode: true,
  pageExtensions: process.env.NODE_ENV === "production" ? ['(?<!(spec|test).)tsx'] : ['tsx'],
  webpack: (config, { isServer }) => {
    config.module.rules.push(
      {
        test: /\.(spec|test).*$/,
        loader: 'ignore-loader'
      }
    );
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});
