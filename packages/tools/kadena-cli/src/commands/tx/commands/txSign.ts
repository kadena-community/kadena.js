import type { Command } from 'commander';
import { createCommand } from '../../../utils/createCommand.js';
import { signWithKeypair } from '../utils/txSignWithKeypair.js';
import { signWithWallet } from '../utils/txSignWithWallet.js';
import { options } from './txSignOptions.js';

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignCommand: (program: Command, version: string) => void =
  createCommand(
    'sign',
    'Sign a transaction using your wallet/keypair.\nThe transaction can be passed via stdin.\nThe signed transaction will be saved to file.',
    options,
    async (option, { stdin, values }) => {
      const signMethod = await option.txSignWith();
      if (signMethod.txSignWith === 'wallet') {
        return signWithWallet(option, values, stdin);
      }
      if (signMethod.txSignWith === 'keyPair') {
        return signWithKeypair(option, values, stdin);
      }
    },
  );
