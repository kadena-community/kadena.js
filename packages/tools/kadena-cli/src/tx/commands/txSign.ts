import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaSignWithKeyPair } from '@kadena/hd-wallet';
import type { IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

/**
 * Signs a Kadena transaction with the provided key pair.
 *
 * @param {Object} config - The configuration object for signing the transaction.
 * @returns {Promise<CommandResult<{}>>} The result of the signing operation.
 */
export const signTransactionAction = async (config: {
  unsignedCommand: IUnsignedCommand;
  keyPublicKey: string;
  keySecretKey: string;
  securityPassword: string;
  legacy?: boolean;
}): Promise<CommandResult<{}>> => {
  if (config.legacy === true) {
    return { success: true, data: {} };
  } else {
    const data = kadenaSignWithKeyPair(
      config.securityPassword,
      config.keyPublicKey,
      config.keySecretKey as EncryptedString,
    )(config.unsignedCommand);

    return { success: true, data };
  }
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-keypair',
  'Sign a transaction using your keypair.',
  [
    globalOptions.txTransactionFilename(),
    globalOptions.keyPublicKey(),
    globalOptions.keySecretKey(),
    globalOptions.securityPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:action')({ config });
      const {
        txTransactionFilename: { unsignedCommand },
        ...rest
      } = config;
      const data = { unsignedCommand, ...rest };

      const result = await signTransactionAction(data);
      assertCommandError(result);

      console.log(chalk.green(`\nTransaction signed successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
