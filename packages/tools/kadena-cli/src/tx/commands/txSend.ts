import type { Command } from 'commander';
import path from 'node:path';

import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import ora from 'ora';
import type {
  ICustomNetworkChoice,
  INetworkCreateOptions,
} from '../../networks/utils/networkHelpers.js';
import { loadNetworkConfig } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { getExistingNetworks } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { parseTransactionsFromStdin } from '../utils/input.js';
import {
  extractCommandData,
  getTransactionsFromFile,
} from '../utils/txHelpers.js';

interface ISubmitResponse {
  transaction: IUnsignedCommand | ICommand;
  requestKey: string;
}

interface INetworkDetails extends INetworkCreateOptions {
  chainId: ChainId;
}

export const sendTransactionAction = async ({
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

      const client = createClient(
        `${details.networkHost}/chainweb/0.0/${details.networkId}/chain/${details.chainId}/pact`,
      );

      const response = await client.submit(command);
      successfulCommands.push({
        transaction: command,
        requestKey: response.requestKey,
      });
    } catch (error) {
      errors.push(`Error in processing transaction: ${error.message}`);
    }
  }

  if (errors.length === transactionsWithDetails.length) {
    return { success: false, errors };
  } else if (errors.length > 0) {
    return {
      success: true,
      data: { transactions: successfulCommands },
      warnings: errors,
    };
  }

  return { success: true, data: { transactions: successfulCommands } };
};

export const createSendTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'send',
  'Send a transaction to the network',
  [
    txOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    txOptions.txTransactionNetwork(),
  ],
  async (option, { stdin }) => {
    const commands: (IUnsignedCommand | ICommand)[] = [];

    if (stdin !== undefined) {
      commands.push(await parseTransactionsFromStdin(stdin));
    } else {
      const { directory } = await option.directory();
      const { txSignedTransactionFiles } =
        await option.txSignedTransactionFiles();
      const absolutePaths = txSignedTransactionFiles.map((file) =>
        path.resolve(path.join(directory, file)),
      );
      commands.push(...(await getTransactionsFromFile(absolutePaths, true)));
    }

    const networkForTransactions = await option.txTransactionNetwork({
      commands,
    });
    const transactionsWithDetails: {
      command: ICommand | IUnsignedCommand;
      details: INetworkDetails;
    }[] = [];

    const existingNetworks: ICustomNetworkChoice[] =
      await getExistingNetworks();

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

    if (transactionsWithDetails.length > 0) {
      const loader = ora('Sending transactions...\n').start();
      const result = await sendTransactionAction({ transactionsWithDetails });
      assertCommandError(result, loader);

      if (result.success) {
        log.info(
          result.data.transactions
            .map(
              ({ transaction, requestKey }) =>
                `Transaction: ${transaction.hash} submitted with request key: ${requestKey}`,
            )
            .join('\n\n'),
        );
      }
    } else {
      log.info('No transactions to send.');
    }
  },
);
