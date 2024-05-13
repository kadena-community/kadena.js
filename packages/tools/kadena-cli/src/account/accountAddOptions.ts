import { globalOptions, securityOptions } from '../utils/globalOptions.js';
import { accountOptions } from './accountOptions.js';

export const options = [
  accountOptions.accountTypeSelection({ isOptional: false }),
  // common options
  accountOptions.accountAlias(),
  accountOptions.fungible(),
  accountOptions.predicate(),
  accountOptions.selectPublicKeys({ isOptional: true }),
  // account manual options
  accountOptions.confirmAccountVerification(),
  globalOptions.networkSelect({ isOptional: true }),
  globalOptions.chainId({ isOptional: true }),
  accountOptions.accountName(),
  // account wallet options
  globalOptions.walletSelect({ isOptional: true }),
  securityOptions.createPasswordOption({
    message: 'Enter the wallet password:',
  }),
];
