import {
  GAS_STATIONS,
  NAMESPACES,
} from '../commands/devnet/faucet/deploy/constants.js';
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
  'No account aliases found. To add an account use `kadena account add` command.';

export const CHAIN_ID_ACTION_ERROR_MESSAGE = 'Please provide a valid Chain ID.';
export const CHAIN_ID_RANGE_ERROR_MESSAGE = `Enter a valid chainId: between 0-${MAX_CHAIN_VALUE}`;
export const KEYS_ALL_PRED_ERROR_MESSAGE =
  'Only "keys-all" predicate is allowed for the given public keys and account name';
export const MAINNET_FUND_TRANSFER_ERROR_MESSAGE =
  'Funding operations are not allowed on mainnet network with network ID:';

export const MAX_FUND_AMOUNT = 20;
