import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const REMOTE_URL =
  serverRuntimeConfig?.REMOTE_URL || publicRuntimeConfig?.REMOTE_URL;
export const STATS_API_BASE_URL =
  serverRuntimeConfig?.STATS_API_BASE_URL ||
  publicRuntimeConfig?.STATS_API_BASE_URL;
export const TEST_NETWORK_API_URL =
  serverRuntimeConfig?.TEST_NETWORK_API_URL ||
  publicRuntimeConfig?.TEST_NETWORK_API_URL;
export const KADDEX_NETWORK_API_URL =
  serverRuntimeConfig?.KADDEX_NETWORK_API_URL ||
  publicRuntimeConfig?.KADDEX_NETWORK_API_URL;
export const MAIN_NETWORK_API_URL =
  serverRuntimeConfig?.MAIN_NETWORK_API_URL ||
  publicRuntimeConfig?.MAIN_NETWORK_API_URL;
export const MAIN_TX_NETWORK_API_URL =
  serverRuntimeConfig?.MAIN_TX_NETWORK_API_URL ||
  publicRuntimeConfig?.MAIN_TX_NETWORK_API_URL;
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const DEFAULT_CHAIN_IDS = Array.from({ length: 20 }, (_, i) => `${i}`);
