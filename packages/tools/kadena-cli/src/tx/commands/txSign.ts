import type { Command } from 'commander';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { txOptions } from '../txOptions.js';
import { signWithAliasFile } from '../utils/txSignWithAliasFile.js';
import { signWithKeypair } from '../utils/txSignWithKeypair.js';
import { signWithLocalWallet } from '../utils/txSignWithLocalWallet.js';

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignCommand: (program: Command, version: string) => void =
  createCommandFlexible(
    'sign',
    'Sign a transaction using your local wallet/aliased file/keypair.\nThe transaction can be passed via stdin.\nThe signed transaction will be saved to file.',
    [
      txOptions.txSignWith(),
      // sign with local wallet
      globalOptions.walletSelect(),
      globalOptions.securityPassword(),
      txOptions.directory({ disableQuestion: true }),
      txOptions.txUnsignedTransactionFiles(),

      // sign with alias file
      globalOptions.keyAliasSelect(),
      globalOptions.legacy({ isOptional: true, disableQuestion: true }),

      // sign with keypair
      globalOptions.keyPairs(),
    ],
    async (option, values, stdin) => {
      const signMethod = await option.txSignWith();
      if (signMethod.txSignWith === 'localWallet') {
        return signWithLocalWallet(option, values, stdin);
      }
      if (signMethod.txSignWith === 'aliasFile') {
        return signWithAliasFile(option, values, stdin);
      }
      if (signMethod.txSignWith === 'keyPair') {
        return signWithKeypair(option, values, stdin);
      }
    },
  );
