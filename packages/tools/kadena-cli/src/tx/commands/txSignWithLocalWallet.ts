import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import { removeAfterFirstDot } from '../../utils/path.util.js';
import { signTransactionWithSeed } from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

export const signActionHd = async (
  walletName: string,
  wallet: EncryptedString,
  password: string,
  unsignedCommand: IUnsignedCommand,
): Promise<CommandResult<ICommand>> => {
  try {
    const signedCommand = await signTransactionWithSeed(
      walletName,
      wallet,
      password,
      unsignedCommand,
    );

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
    globalOptions.txTransactionDir({ isOptional: true }),
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

      const wallet =
        typeof keyWallet === 'string' ? keyWallet : keyWallet.wallet;

      const walletName =
        typeof keyWallet === 'string'
          ? keyWallet
          : removeAfterFirstDot(keyWallet.fileName);

      const result = await signActionHd(
        walletName,
        wallet as EncryptedString,
        securityPassword,
        unsignedCommand as IUnsignedCommand,
      );

      assertCommandError(result);

      await saveSignedTransaction(
        result.data,
        config.txTransaction.transactionFile,
        config.txTransactionDir,
      );

      console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
