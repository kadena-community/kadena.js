const withMarkdoc = require('@markdoc/next.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = withMarkdoc({
  ...nextConfig,
  schemaPath: './src/markdoc',
  mode: 'static',
})({
  pageExtensions: ['md', 'mdoc', 'js', 'jsx', 'ts', 'tsx'],
});
