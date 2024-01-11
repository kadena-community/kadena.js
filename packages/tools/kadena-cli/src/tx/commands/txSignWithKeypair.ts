import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { signTransaction } from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionWithKeypairCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-keypair',
  'Sign a transaction using a keypair.',
  [
    globalOptions.txTransaction(),
    globalOptions.keyPublicKey(),
    globalOptions.keySecretKey(),
    globalOptions.securityPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:keypair:action')({ config });
      const {
        txTransaction: { unsignedCommand },
        ...rest
      } = config;
      const data = { unsignedCommand, ...rest };

      const result = await signTransaction(data);
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
