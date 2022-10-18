/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  publicRuntimeConfig: {
    REMOTE_URL: 'https://kadena.architech.nyc',
    STATS_API_BASE_URL: 'https://estats.chainweb.com',
    KADDEX_NETWORK_API_URL: 'https://devnet.kaddex.com',
    TEST_NETWORK_API_URL: 'https://api.testnet.chainweb.com',
    MAIN_TX_NETWORK_API_URL: 'https://api.chainweb.com',
    MAIN_NETWORK_API_URL: 'https://estats.chainweb.com',
  },
  serverRuntimeConfig: {
    REMOTE_URL: 'https://kadena.architech.nyc',
    STATS_API_BASE_URL: 'https://estats.chainweb.com',
    KADDEX_NETWORK_API_URL: 'https://devnet.kaddex.com',
    TEST_NETWORK_API_URL: 'https://api.testnet.chainweb.com',
    MAIN_TX_NETWORK_API_URL: 'https://api.chainweb.com',
    MAIN_NETWORK_API_URL: 'https://estats.chainweb.com',
  },
  env: {
    REMOTE_URL: 'https://kadena.architech.nyc',
    STATS_API_BASE_URL: 'https://estats.chainweb.com',
    KADDEX_NETWORK_API_URL: 'https://devnet.kaddex.com',
    TEST_NETWORK_API_URL: 'https://api.testnet.chainweb.com',
    MAIN_TX_NETWORK_API_URL: 'https://api.chainweb.com',
    MAIN_NETWORK_API_URL: 'https://estats.chainweb.com',
  },
}

module.exports = nextConfig
