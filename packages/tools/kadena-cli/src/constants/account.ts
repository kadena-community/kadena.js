import {
  GAS_STATIONS,
  NAMESPACES,
} from './../devnet/faucet/deploy/constants.js';
import { MAX_CHAIN_VALUE } from './config.js';

export const GAS_STATIONS_MAP: { [key: string]: string } = {
  development: GAS_STATIONS.DEV_NET,
  testnet04: GAS_STATIONS.TEST_NET,
} as const;

export const NAMESPACES_MAP: { [key: string]: string } = {
  development: NAMESPACES.DEV_NET,
  testnet04: NAMESPACES.TEST_NET,
};

export const NO_ACCOUNTS_FOUND_ERROR_MESSAGE =
  'No account aliases found. To add an account use `account add-manual` or `account add-from-wallet` command.';

export const CHAIN_ID_ACTION_ERROR_MESSAGE = 'Please provide a valid Chain ID.';
export const CHAIN_ID_RANGE_ERROR_MESSAGE = `Enter a valid chainId: between 0-${MAX_CHAIN_VALUE}`;
export const KEYS_ALL_PRED_ERROR_MESSAGE =
  'Only "keys-all" predicate is allowed for the given public keys and account name';
