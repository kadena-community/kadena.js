/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/graph',
        destination: 'http://localhost:4000/graphql',
      },
    ];
  },
};

module.exports = nextConfig;
