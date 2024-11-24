export const NAMESPACES = {
  DEV_NET: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
  TEST_NET: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
} as const;

export const GAS_STATIONS = {
  DEV_NET: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
  TEST_NET: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
} as const;

export const GAS_STATIONS_MAP: { [key: string]: string } = {
  development: GAS_STATIONS.DEV_NET,
  testnet04: GAS_STATIONS.TEST_NET,
} as const;

export const NAMESPACES_MAP: { [key: string]: string } = {
  development: NAMESPACES.DEV_NET,
  testnet04: NAMESPACES.TEST_NET,
};

export const DEFAULT_CONTRACT_NAME = 'coin-faucet';
