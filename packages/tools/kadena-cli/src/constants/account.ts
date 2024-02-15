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

export const NO_ACCOUNT_ERROR_MESSAGE =
  'No valid accounts found. To create an account use `account add-manual` or `account add-from-wallet` command.';
