import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { signTransactionWithKeyPair } from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

export const signActionPlain = async (
  unsignedCommand: IUnsignedCommand,
  keyPairs: IKeyPair[],
  legacy?: boolean,
): Promise<CommandResult<ICommand>> => {
  try {
    /*
  [{"publicKey":"5fb604897e796628545ccb9b04c35065656f8bbda358a65a65c4a42a0a891ed1","secretKey":"045a38d02bc5c61a41aabdd811438a5bc0e51c343c22a1938f7bbd6e4c4f902f"},{"publicKey":"9298b9d3f2dfd741b4e0aff1f095413841865f7631ed7d43b301c0088f0da1dc","secretKey":"d03574d7f243663e027847d18ddb36f2e315b330fcf742512dfad355ed138efa"}]
  leg [{"publicKey":"a3823dee061d891733e65625a06513ee5f0ee1c451b327dfa6b60b64ecb5339a","secretKey":"cGpYVG1IUTJsT2YrQnRzOWdLbGN5QT09LlExaHdkZHlXUkhUblNvMjMuZFlaL2NIVmY2RHNjbDMwQVhVd2F3Zz09LkdadzN3a0tJdFdwVGxuTWowQUIvN0szRXR4Q01VZ3BGZTlzYUIxQmpzai9kb0dMU2hEcWxDN0xiMDZkSGVIWlpNUjZtV3NTVTN2b2ZBYTNqd2pibnBBelRzVFYzV1ZDMDlkTk9iL3NhMEg5elV1V0poSDJjVHNIbUFzK1lOaHhvNlJmSGgyakIvb1ZnTzZXL2J2QXd1QUkzQ0RDS0NwYzZzNy93K2d2M01zND0ubzRJOTdnWWRpUmN6NWxZbG9HVVQ3bDhPNGNSUnN5ZmZwcllMWk95MU01bz0="},{"publicKey":"ef303f8463a8a9342776f9e5ee501b8e0bd85ad88fbafcc59a8cb13bddfd3a99","secretKey":"UVpRZlNkczdKMG1JdkkxQ1l1UHd0UT09Lmg2dWxodjdOMHFoenNVM1cuV1ZRVW1kT0wrY25kVDY0SW03dC91dz09LjNTZkdxMUFZNjZQNjc1N2dvMGhrQzJUdEZ1Y3oyTU9vOEl1RWI2WDNnY3kvVFlOWW1ISDFCcmJDVHlGWStiWHByYm9NNHVSbnZtZ3g1aERSNDRnM3YxeWRyWGZEc3lVUjhJSUIyN3NDTzZSN0VFN0FEcVZwN0cwaDV0UmkxYnZzOUFEUnBPeVlORTNBSC80MHlSZldReU5rTFFYZkxCMUVrTWtrRkFOK1JPaz0uN3pBL2hHT29xVFFuZHZubDdsQWJqZ3ZZV3RpUHV2ekZtb3l4TzkzOU9waz0="}]
*/

    const signedCommand = await signTransactionWithKeyPair(
      keyPairs,
      unsignedCommand,
      legacy,
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
export const createSignTransactionWithKeypairCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'sign-with-keypair',
  'Sign a transaction using a keypair.',
  [
    globalOptions.txTransaction(),
    globalOptions.keyPairs(),
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('sign-transaction:keypair:action')({ config });
      const {
        txTransaction: { unsignedCommand },
      } = config;

      const result = await signActionPlain(
        unsignedCommand as IUnsignedCommand,
        config.keyPairs,
        config.legacy,
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
