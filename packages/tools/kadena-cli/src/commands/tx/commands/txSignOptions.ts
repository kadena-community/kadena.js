import {
  globalOptions,
  securityOptions,
} from '../../../utils/globalOptions.js';
import { txOptions } from '../txOptions.js';

export const options = [
  txOptions.txSignWith(),
  // sign with wallet
  globalOptions.walletsSelectByWallet(),
  securityOptions.createPasswordOption({
    message: 'Enter the wallet password:',
  }),
  globalOptions.directory({ disableQuestion: true }),
  txOptions.txUnsignedTransactionFiles(),

  globalOptions.legacy({ isOptional: true, disableQuestion: true }),

  // sign with keypair
  globalOptions.keyPairs(),
];
