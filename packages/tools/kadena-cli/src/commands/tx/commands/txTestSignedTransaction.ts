import type { Command } from 'commander';

import type {
  IClient,
  ICommand,
  ICommandResult,
  IUnsignedCommand,
} from '@kadena/client';
import { isSignedTransaction } from '@kadena/client';
import path from 'node:path';

import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';

import { txOptions } from '../txOptions.js';
import { txDisplayTransaction } from '../utils/txDisplayHelper.js';
import type { INetworkDetails, ISubmitResponse } from '../utils/txHelpers.js';
import {
  createTransactionWithDetails,
  getClient,
  getTransactionsFromFile,
} from '../utils/txHelpers.js';

const clientInstances: Map<string, IClient> = new Map();

export const testTransactionAction = async ({
  transactionsWithDetails,
}: {
  transactionsWithDetails: {
    command: ICommand | IUnsignedCommand;
    details: INetworkDetails;
  }[];
}): Promise<CommandResult<{ transactions: ISubmitResponse[] }>> => {
  const successfulCommands: ISubmitResponse[] = [];
  const errors: string[] = [];

  for (const { command, details } of transactionsWithDetails) {
    try {
      if (!isSignedTransaction(command)) {
        errors.push(`Invalid signed transaction: ${JSON.stringify(command)}`);
        continue;
      }

      const client = getClient(clientInstances, details);
      const response: ICommandResult = await client.local(command, {
        preflight: false,
        signatureVerification: true,
      });
      successfulCommands.push({
        transaction: command,
        details,
        requestKey: 'N/A',
        clientKey: `${details.networkHost}-${details.networkId}-${details.chainId}`,
        response,
      });
    } catch (error) {
      errors.push(`Error in processing transaction: ${error.message}`);
    }
  }

  if (errors.length === transactionsWithDetails.length) {
    return { status: 'error', errors };
  } else if (errors.length > 0) {
    return {
      status: 'success',
      data: { transactions: successfulCommands },
      warnings: errors,
    };
  }

  return { status: 'success', data: { transactions: successfulCommands } };
};

export const createTestSignedTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'test',
  'Test a signed transaction on (network choice).',
  [
    globalOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    txOptions.txTransactionNetwork(),
  ],
  async (option) => {
    const commands: (IUnsignedCommand | ICommand)[] = [];

    const directory = (await option.directory()).directory ?? process.cwd();
    const { txSignedTransactionFiles } = await option.txSignedTransactionFiles({
      signed: true,
    });
    const absolutePaths = txSignedTransactionFiles.map((file) =>
      path.resolve(path.join(directory, file)),
    );
    commands.push(...(await getTransactionsFromFile(absolutePaths, true)));

    const networkForTransactions = await option.txTransactionNetwork({
      commands,
    });

    const transactionsWithDetails = await createTransactionWithDetails(
      commands,
      networkForTransactions,
    );

    const result = await testTransactionAction({ transactionsWithDetails });
    assertCommandError(result);

    return txDisplayTransaction(
      result.data,
      txSignedTransactionFiles,
      'txSignedTransaction test result:',
    );
  },
);
