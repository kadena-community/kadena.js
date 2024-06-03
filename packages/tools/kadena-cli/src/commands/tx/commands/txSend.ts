import type { Command } from 'commander';
import path from 'node:path';

import type {
  IClient,
  ICommand,
  IPollOptions,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import { isSignedTransaction } from '@kadena/client';
import ora from 'ora';
import { IS_TEST } from '../../../constants/config.js';

import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { parseTransactionsFromStdin } from '../utils/input.js';
import { displayTransactionResponse } from '../utils/txDisplayHelper.js';
import type { INetworkDetails, ISubmitResponse } from '../utils/txHelpers.js';
import {
  createTransactionWithDetails,
  getClient,
  getTransactionsFromFile,
  logTransactionDetails,
} from '../utils/txHelpers.js';

const clientInstances: Map<string, IClient> = new Map();

export async function pollRequests(
  requestKeys: ISubmitResponse[],
): Promise<void> {
  const pollingPromises = requestKeys.map(
    ({ requestKey, clientKey, details }) => {
      const client = clientInstances.get(clientKey);
      if (!client) {
        log.error(
          `No client found for requestKey: ${requestKey} with clientKey: ${clientKey}. Polling will not be done for this request.`,
        );
        return Promise.resolve({
          requestKey,
          status: 'error',
          message: `Client not found for ${clientKey}`,
        });
      }

      const options: IPollOptions = {
        onPoll: (rqKey) => log.info('Polling status of', rqKey),
      };

      const transactionDescriptor: ITransactionDescriptor = {
        requestKey,
        networkId: details.networkId,
        chainId: details.chainId,
      };

      return client
        .pollStatus(transactionDescriptor, options)
        .then((data) => ({ requestKey, status: 'success', data }))
        .catch((error) => ({ requestKey, status: 'error', error }));
    },
  );

  const results = await Promise.allSettled(pollingPromises);

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const value = result.value;
      const { requestKey, status } = value;

      if (status === 'success' && 'data' in value) {
        log.info(`Polling success for requestKey: ${requestKey}`);
        displayTransactionResponse(value.data[requestKey], 2);
      } else if (status === 'error' && 'error' in value) {
        log.error(
          `Polling error for requestKey: ${requestKey}, error:`,
          value.error,
        );
      } else if ('message' in value) {
        log.info(
          `Polling message for requestKey: ${requestKey}: ${value.message}`,
        );
      }
    } else {
      log.error(`Polling failed for a request, error:`, result.reason);
    }
  });
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

      const client = getClient(clientInstances, details);

      await logTransactionDetails(command);
      const localResponse = await client.local(command);
      if (localResponse.result.status === 'failure') {
        throw localResponse.result.error;
      }

      const response = await client.submit(command);
      successfulCommands.push({
        transaction: command,
        details,
        requestKey: response.requestKey,
        clientKey: `${details.networkHost}-${details.networkId}-${details.chainId}`,
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

export const createSendTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'send',
  'Send a transaction to the network',
  [
    globalOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    txOptions.txTransactionNetwork(),
    txOptions.poll(),
  ],
  async (option, { stdin }) => {
    const commands: (IUnsignedCommand | ICommand)[] = [];

    if (stdin !== undefined) {
      commands.push(await parseTransactionsFromStdin(stdin));
    } else {
      const { directory } = await option.directory();
      const { txSignedTransactionFiles } =
        await option.txSignedTransactionFiles({ signed: true });
      const absolutePaths = txSignedTransactionFiles.map((file) =>
        path.resolve(path.join(directory, file)),
      );
      commands.push(...(await getTransactionsFromFile(absolutePaths, true)));
    }

    const networkForTransactions = await option.txTransactionNetwork({
      commands,
    });

    const transactionsWithDetails = await createTransactionWithDetails(
      commands,
      networkForTransactions,
    );

    if (transactionsWithDetails.length > 0) {
      const loader = ora({
        text: 'Sending transactions...\n',
        isEnabled: !IS_TEST,
      }).start();
      const result = await sendTransactionAction({ transactionsWithDetails });
      assertCommandError(result, loader);

      if (result.status === 'success') {
        log.info(
          result.data.transactions
            .map(
              ({ transaction, requestKey }) =>
                `Transaction: ${transaction.hash} submitted with request key: ${requestKey}`,
            )
            .join('\n\n'),
        );
      }

      const txPoll = await option.poll();

      if (txPoll.poll === true) {
        await pollRequests(result.data.transactions);
      }
    } else {
      log.info('No transactions to send.');
    }
  },
);
