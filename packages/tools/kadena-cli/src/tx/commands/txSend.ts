import type { Command } from 'commander';

import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import path from 'node:path';
import { clientSendWrapper } from '../../utils/client.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { txOptions } from '../txOptions.js';
import { parseTransactionsFromStdin } from '../utils/input.js';
import { getTransactionsFromFile } from '../utils/txHelpers.js';

// import { globalOptions } from '../../utils/globalOptions.js';

/*

kadena tx send ??
*/
type IAnyCommand = IUnsignedCommand | ICommand;
const isFilePaths = (
  transactions: IAnyCommand[] | string[],
): transactions is string[] => {
  return typeof transactions[0] === 'string';
};
interface ISubmitResponse {
  transaction: IAnyCommand;
  requestKey: string;
}

const isFilePaths = (
  transactions: (IUnsignedCommand | ICommand)[] | string[],
): transactions is string[] => {
  return typeof transactions[0] === 'string';
};

interface ISubmitResponse {
  transaction: IUnsignedCommand | ICommand;
  requestKey: string;
}

export const sendTransactionAction = async ({
  chainId,
  networkHost,
  networkId,
  transactions: transactionsInput,
}: {
  networkId: string;
  networkHost: string;
  chainId: string;
  /** Command object of filepath to JSON file with command object */
  transactions: (IUnsignedCommand | ICommand)[] | string[];
}): Promise<CommandResult<{ transactions: ISubmitResponse[] }>> => {
  const client = createClient(
    `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

  let transactions: (IUnsignedCommand | ICommand)[] = [];

  if (isFilePaths(transactionsInput)) {
    transactions = await getTransactionsFromFile(transactionsInput, true);
  } else {
    transactions = transactionsInput;
  }

  const successfulCommands: ISubmitResponse[] = [];
  const errors: string[] = [];

  for (const command of transactions) {
    try {
      if (!isSignedTransaction(command)) {
        errors.push(`Invalid signed transaction: ${JSON.stringify(command)}`);
        continue;
      }

      const response = await clientSendWrapper(() => client.submit(command));

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
  'send a transaction to the network',
  [
    txOptions.directory({ disableQuestion: true }),
    txOptions.txSignedTransactionFiles(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (option, values, stdin) => {
    const commands: IUnsignedCommand[] = [];
    const filePaths: string[] = [];

    if (stdin !== undefined) {
      commands.push(await parseTransactionsFromStdin(stdin));
    } else {
      const directory = (await option.directory()).directory ?? process.cwd();
      const { txSignedTransactionFiles } =
        await option.txSignedTransactionFiles();
      const absolutePaths = txSignedTransactionFiles.map((file) =>
        path.resolve(path.join(directory, file)),
      );
      filePaths.push(...absolutePaths);
    }

    const { networkConfig } = await option.network();
    const { chainId } = await option.chainId();

    const result = await sendTransactionAction({
      ...networkConfig,
      chainId: chainId,
      transactions: commands.length ? commands : filePaths,
    });
    assertCommandError(result);

    console.log(
      result.data.transactions
        .map(
          (transaction) =>
            `Transaction: ${transaction.transaction.hash} submitted with request key: ${transaction.requestKey}`,
        )
        .join('\n\n'),
    );
  },
);
