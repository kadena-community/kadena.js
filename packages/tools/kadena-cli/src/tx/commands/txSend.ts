import type { Command } from 'commander';
import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import ora from 'ora';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { parseTransactionsFromStdin } from '../utils/input.js';
import { getTransactionsFromFile } from '../utils/txHelpers.js';

interface ISubmitResponse {
  transaction: IUnsignedCommand | ICommand;
  requestKey: string;
}

export const sendTransactionAction = async ({
  chainId,
  networkHost,
  networkId,
  transactions,
}: {
  networkId: string;
  networkHost: string;
  chainId: string;
  /** Command object of filepath to JSON file with command object */
  transactions: (IUnsignedCommand | ICommand)[];
}): Promise<CommandResult<{ transactions: ISubmitResponse[] }>> => {
  const client = createClient(
    `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

  const successfulCommands: ISubmitResponse[] = [];
  const errors: string[] = [];

  for (const command of transactions) {
    try {
      if (!isSignedTransaction(command)) {
        errors.push(`Invalid signed transaction: ${JSON.stringify(command)}`);
        continue;
      }

      const response = await client.submit(command);

      successfulCommands.push({
        transaction: command,
        requestKey: response.requestKey,
      });
    } catch (error) {
      errors.push(`Error in processing transaction: ${error.message}`);
    }
  }

  if (errors.length === transactions.length) {
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
) => void = createCommandFlexible(
  'send',
  'Send a transaction to the network',
  [
    txOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (option, values, stdin) => {
    const commands: IUnsignedCommand[] = [];

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

    const { networkConfig } = await option.network();
    const { chainId } = await option.chainId();

    const loader = ora('Sending transaction...\n').start();

    const result = await sendTransactionAction({
      ...networkConfig,
      chainId: chainId,
      transactions: commands,
    });
    assertCommandError(result, loader);

    log.info(
      result.data.transactions
        .map(
          (transaction) =>
            `Transaction: ${transaction.transaction.hash} submitted with request key: ${transaction.requestKey}`,
        )
        .join('\n\n'),
    );
  },
);
