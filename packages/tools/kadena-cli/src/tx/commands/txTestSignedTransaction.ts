import type { Command } from 'commander';

import type { ICommandResult } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import path from 'node:path';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { txDisplayTransaction } from '../utils/txDisplayHelper.js';
import { getTransactionsFromFile } from '../utils/txHelpers.js';

export const testTransactions = async (
  networkConfig: {
    networkHost: string;
    networkId: string;
  },
  chainId: string,
  /** absolute paths, or relative to process.cwd() if starting with `.` */
  transactionFileNames: string[],
  signed: boolean,
): Promise<CommandResult<ICommandResult[]>> => {
  const client = createClient(
    `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
  );

  const signedTransactions = await getTransactionsFromFile(
    transactionFileNames,
    signed,
  );

  const successfulCommands: ICommandResult[] = [];
  const errors: string[] = [];

  for (const command of signedTransactions) {
    try {
      if (isSignedTransaction(command)) {
        const response: ICommandResult = await client.local(command, {
          preflight: false,
          signatureVerification: true,
        });
        successfulCommands.push(response);
      } else {
        errors.push(`Invalid signed transaction: ${JSON.stringify(command)}`);
      }
    } catch (error) {
      errors.push(`Error in processing transaction: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    data: successfulCommands,
    errors: errors,
  };
};

export const createTestSignedTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'test',
  'Test a signed transaction on testnet.',
  [
    txOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    globalOptions.network({ isOptional: false }),
    globalOptions.chainId(),
  ],
  async (option) => {
    const networkOption = await option.network();
    const directory = (await option.directory()).directory ?? process.cwd();
    const files = await option.txSignedTransactionFiles({
      signed: true,
      path: directory,
    });
    const chainOption = await option.chainId();

    log.debug('sign-with-local-wallet:action', {
      ...networkOption,
      directory,
      ...files,
      ...chainOption,
    });

    const absolutePaths = files.txSignedTransactionFiles.map((file) =>
      path.resolve(path.join(directory, file)),
    );

    const result = await testTransactions(
      networkOption.networkConfig,
      chainOption.chainId,
      absolutePaths,
      true,
    );

    assertCommandError(result);
    return txDisplayTransaction(
      result.data,
      files.txSignedTransactionFiles,
      'txSignedTransaction result:',
    );
  },
);
