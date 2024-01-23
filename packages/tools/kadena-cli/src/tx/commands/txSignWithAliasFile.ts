import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
// import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import {
  // getSignersFromTransactionPlain,
  signTransactionWithKeyPair,
} from '../utils/helpers.js';
// import { saveSignedTransaction } from '../utils/storage.js';

import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

export const signActionPlain = async (
  unsignedCommand: IUnsignedCommand,
  keyPairs: IKeyPair[],
): Promise<CommandResult<ICommand>> => {
  try {
    if (keyPairs.length === 0) {
      throw new Error('Error signing transaction: no keys found.');
    }
    const signedCommand = await signTransactionWithKeyPair(
      keyPairs,
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
export const createSignTransactionWithAliasFileCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-alias-file',
  'Sign a transaction using your local aliased file containing your keypair.',
  [
    // rewrite to flexible command
    // select wallet
    // result all => all aliases
    // result wallet => all aliases in wallet
    // select alias
    globalOptions.keyAlias(),
    // get content from keyAlias file
    globalOptions.txTransaction(),
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:alias-file:action')({ config });
      const {
        txTransaction: { unsignedCommand },
      } = config;

      // const result = await signActionPlain(
      //   unsignedCommand as IUnsignedCommand,
      //   [config.keyAlias], // Todo: key alias content ( IKeyPair )
      // );

      // assertCommandError(result);

      // await saveSignedTransaction(
      //   result.data,
      //   config.txTransaction.transactionFile,
      //   config.txTransactionDir
      // );

      console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
