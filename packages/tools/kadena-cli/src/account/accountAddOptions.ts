import { globalOptions } from '../utils/globalOptions.js';
import { accountOptions } from './accountOptions.js';

export const options = [
  accountOptions.accountTypeSelection(),
  // common options
  accountOptions.accountAlias(),
  accountOptions.fungible(),
  globalOptions.networkSelect(),
  globalOptions.chainId(),
  accountOptions.accountOverwrite(),
  accountOptions.predicate(),
  // account manual options
  accountOptions.accountName(),
  // account wallet options
  globalOptions.walletSelect(),
  accountOptions.selectPublicKeys(),
];
