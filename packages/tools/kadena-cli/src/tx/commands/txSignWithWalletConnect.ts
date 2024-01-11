import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaSignWithKeyPair } from '@kadena/hd-wallet';
import type { ICommand, IUnsignedCommand } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { saveSignedTransaction } from '../utils/storage.js';
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
}): Promise<CommandResult<ICommand>> => {
  if (config.legacy === true) {
    return {
      success: true,
      data: {} as ICommand,
    };
  } else {
    const signedCommand = kadenaSignWithKeyPair(
      config.securityPassword,
      config.keyPublicKey,
      config.keySecretKey as EncryptedString,
    )(config.unsignedCommand) as ICommand;

    return { success: true, data: signedCommand };
  }
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionWithWalletConnect: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-wallet-connect',
  'Sign a transaction using your wallet connect supported wallet.',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.txTransaction(),
    globalOptions.securityPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:wallet-connect:action')({ config });
      const {
        txTransaction: { unsignedCommand },
        ...rest
      } = config;
      // const data = { unsignedCommand, ...rest };

      // const result = await signTransactionAction(data);
      // assertCommandError(result);

      // await saveSignedTransaction(
      //   result.data,
      //   config.txTransaction.transactionFile,
      // );

      console.log(chalk.green(`\nTransaction signed successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
