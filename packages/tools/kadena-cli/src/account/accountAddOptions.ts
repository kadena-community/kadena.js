import { globalOptions } from '../utils/globalOptions.js';
import { accountOptions } from './accountOptions.js';

export const options = [
  accountOptions.accountTypeSelection({ isOptional: false }),
  // common options
  accountOptions.accountAlias(),
  accountOptions.fungible(),
  accountOptions.predicate(),
  accountOptions.selectPublicKeys(),
  // account manual options
  globalOptions.networkSelect({ isOptional: true }),
  globalOptions.chainId({ isOptional: true }),
  accountOptions.accountName(),
  // account wallet options
  globalOptions.walletSelect({ isOptional: true }),
];
