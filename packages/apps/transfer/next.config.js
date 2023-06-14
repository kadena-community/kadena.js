/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  reactStrictMode: true,
  pageExtensions: ['^((?!(test|spec)).)*.tsx$'],
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(spec|test).*$/,
        loader: 'ignore-loader'
      }
    );
    return config;
  }
});
