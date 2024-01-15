import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import type { EncryptedString } from '@kadena/hd-wallet';
import { removeAfterFirstDot } from '../../utils/path.util.js';
import {
  decryptSecretKeys,
  getSignersFromTransactionHd,
  signTransaction,
} from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

export const signActionHd = async (
  unsignedCommand: IUnsignedCommand,
  walletName: string,
  password: string,
): Promise<CommandResult<ICommand>> => {
  try {
    const keys = await getSignersFromTransactionHd(
      unsignedCommand.cmd,
      walletName,
    );

    if (keys.length === 0) {
      throw new Error('Error signing transaction: no keys found.');
    }

    const decryptedKeys = keys.map((key) => {
      return {
        publicKey: key.publicKey,
        secretKey: decryptSecretKeys(password)(
          key.secretKey as EncryptedString,
        ),
      };
    }) as IKeyPair[];

    const signedCommand = await signTransaction(decryptedKeys)({
      unsignedCommand,
    });

    if (!signedCommand) {
      throw new Error('Error signing transaction: transaction not signed.');
    }

    return { success: true, data: signedCommand };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signAction: ${error.message}`],
    };
  }
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionWithLocalWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-local-wallet',
  'Sign a transaction using your local  wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.securityPassword(),
    globalOptions.txTransaction(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:keypair:action')({ config });
      const {
        txTransaction: { unsignedCommand },
        keyWallet,
        securityPassword,
      } = config;

      const walletName =
        typeof keyWallet === 'string'
          ? keyWallet
          : removeAfterFirstDot(keyWallet.fileName);

      const result = await signActionHd(
        unsignedCommand,
        walletName,
        securityPassword,
      );

      assertCommandError(result);

      await saveSignedTransaction(
        result.data,
        config.txTransaction.transactionFile,
      );

      console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
