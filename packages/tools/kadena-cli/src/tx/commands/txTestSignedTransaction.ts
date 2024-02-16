import type { Command } from 'commander';
import debug from 'debug';

import type { ICommandResult } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import path from 'node:path';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
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
) => void = createCommandFlexible(
  'test-signed-transaction',
  'test a signed transaction.',
  [
    txOptions.txTransactionDir({ isOptional: true }),
    txOptions.txSignedTransactionFiles(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (option) => {
    const networkOption = await option.network();
    const dir = await option.txTransactionDir();
    const files = await option.txSignedTransactionFiles({
      signed: true,
      path: dir.txTransactionDir,
    });
    const chainOption = await option.chainId();

    debug.log('sign-with-local-wallet:action', {
      ...networkOption,
      ...dir,
      ...files,
      ...chainOption,
    });

    const absolutePaths = files.txSignedTransactionFiles.map((file) =>
      path.resolve(path.join(dir.txTransactionDir, file)),
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
