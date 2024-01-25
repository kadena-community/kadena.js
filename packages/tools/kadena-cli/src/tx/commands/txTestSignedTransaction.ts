import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { createClient, isSignedTransaction } from '@kadena/client';
import type { ICommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { getTransactionFromFile } from '../utils/helpers.js';
import { txDisplayTransaction } from '../utils/txDisplayHelper.js';

export const testTransactionAction = async (
  signedCommand: ICommand,
  config: {
    networkHost: string;
    networkId: string;
    chainId: string;
  },
): Promise<CommandResult<{}>> => {
  const client = createClient(
    `${config.networkHost}/chainweb/0.0/${config.networkId}/chain/${config.chainId}/pact`,
  );

  try {
    const response = await client.local(signedCommand, {
      preflight: false,
      signatureVerification: true,
    });
    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signedTransasction: ${error.message}`],
    };
  }
};

export const createTestSignedTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'test-signed-transaction',
  'test a signed transaction.',
  [
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.txSignedTransactionFile(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (config) => {
    try {
      debug.log('test-signed-transaction:action')({ config });

      const txSignedTransaction = await getTransactionFromFile(
        config.txSignedTransactionFile,
        true,
        config.txTransactionDir,
      );

      if (isSignedTransaction(txSignedTransaction)) {
        const result = await testTransactionAction(txSignedTransaction, {
          ...config.networkConfig,
          chainId: config.chainId,
        });
        assertCommandError(result);
        return txDisplayTransaction(result.data, 'txSignedTransaction result:');
      }
      console.error(chalk.red(`\nErreor: Transaction is not signed \n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
