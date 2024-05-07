import type { Command } from 'commander';

import type {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IUnsignedCommand,
} from '@kadena/client';
import { isSignedTransaction } from '@kadena/client';
import path from 'node:path';
import type { ICustomNetworkChoice } from '../../networks/utils/networkHelpers.js';
import { loadNetworkConfig } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { getExistingNetworks } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { txDisplayTransaction } from '../utils/txDisplayHelper.js';
import type {
  INetworkDetails,
  ISubmitResponse,
  ITransactionWithDetails,
} from '../utils/txHelpers.js';
import {
  extractCommandData,
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

export const createTransactionWithDetails = async (
  commands: (ICommand | IUnsignedCommand)[],
  networkForTransactions: {
    txTransactionNetwork: string[];
  },
): Promise<ITransactionWithDetails[]> => {
  const transactionsWithDetails: ITransactionWithDetails[] = [];
  const existingNetworks: ICustomNetworkChoice[] = await getExistingNetworks();

  for (let index = 0; index < commands.length; index++) {
    const command = commands[index];
    const network = networkForTransactions.txTransactionNetwork[index];

    if (!existingNetworks.some((item) => item.value === network)) {
      log.error(
        `Network "${network}" does not exist. Please create it using "kadena network create" command, the transaction "${
          index + 1
        }" with hash "${command.hash}" will not be sent.`,
      );
      continue;
    }

    const networkDetails = await loadNetworkConfig(network);
    const commandData = extractCommandData(command);

    if (commandData.networkId === networkDetails.networkId) {
      transactionsWithDetails.push({
        command,
        details: {
          chainId: commandData.chainId as ChainId,
          ...networkDetails,
        },
      });
    } else {
      log.error(
        `Network ID: "${commandData.networkId}" in transaction command ${
          index + 1
        } does not match the Network ID: "${
          networkDetails.networkId
        }" from the provided network "${network}", transaction with hash "${
          command.hash
        }" will not be sent.`,
      );
    }
  }
  return transactionsWithDetails;
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
