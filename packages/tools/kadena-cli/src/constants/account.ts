import {
  GAS_STATIONS,
  NAMESPACES,
} from './../devnet/faucet/deploy/constants.js';

export const GAS_STATIONS_MAP: { [key: string]: string } = {
  'fast-development': GAS_STATIONS.DEV_NET,
  testnet04: GAS_STATIONS.TEST_NET,
} as const;

export const NAMESPACES_MAP: { [key: string]: string } = {
  'fast-development': NAMESPACES.DEV_NET,
  testnet04: NAMESPACES.TEST_NET,
};

export const NO_ACCOUNTS_FOUND_ERROR_MESSAGE =
  'No account aliases found. To add an account use `account add-manual` or `account add-from-wallet` command.';
