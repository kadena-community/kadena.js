import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { txOptions } from '../txOptions.js';

export const options = [
  txOptions.txSignWith(),
  // sign with local wallet
  securityOptions.createPasswordOption({
    message: 'Enter the wallet password',
  }),
  globalOptions.walletsSelectByWallet(),
  txOptions.directory({ disableQuestion: true }),
  txOptions.txUnsignedTransactionFiles(),

  // sign with alias file
  globalOptions.keyAliasSelect(),
  globalOptions.legacy({ isOptional: true, disableQuestion: true }),

  // sign with keypair
  globalOptions.keyPairs(),
];
