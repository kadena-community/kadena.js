import type { ChainId, ICommandResult } from '@kadena/client';
import { createClient } from '@kadena/client';
import type { Table } from 'cli-table3';
import type { Command } from 'commander';
import ora from 'ora';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { createTable } from '../../../utils/table.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import { txOptions } from '../txOptions.js';
import { updateTransactionStatus } from '../utils/txHelpers.js';

export const getTxStatus = async ({
  requestKey,
  chainId,
  networkConfig,
  poll,
}: {
  requestKey: string;
  chainId: ChainId;
  networkConfig: Omit<INetworkCreateOptions, 'networkExplorerUrl'>;
  poll: boolean;
}): Promise<CommandResult<ICommandResult>> => {
  const notFoundErrorMessage = `No Transaction found for requestkey "${requestKey}" on network "${networkConfig.networkId}" and chain "${chainId}".`;
  try {
    const { getStatus, pollStatus } = createClient(
      `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
    );
    let result = null;
    const payload = {
      requestKey: requestKey,
      chainId: chainId,
      networkId: networkConfig.networkId,
    };
    if (poll) {
      result = await pollStatus(payload, {
        timeout: 60000,
      });
    } else {
      result = await getStatus(payload);
    }

    const trimmedRequestKey = requestKey.endsWith('=')
      ? requestKey.slice(0, -1)
      : requestKey;

    if (result[trimmedRequestKey] === undefined) {
      return {
        status: 'error',
        errors: [
          notFoundErrorMessage,
          `If the transaction is just submitted, please try with poll flag: kadena tx status --request-key=${requestKey} --chain-id=${chainId} --network=${networkConfig.network} --poll`,
        ],
      };
    }

    // To update the log file with the transaction status when requestKey is found
    await updateTransactionStatus([
      {
        requestKey,
        status: result[trimmedRequestKey].result.status,
        data: result[trimmedRequestKey],
      },
    ]);

    return {
      status: 'success',
      data: result[trimmedRequestKey],
    };
  } catch (error) {
    const errorMessage =
      error.message === 'TIME_OUT_REJECT'
        ? `Request timed out.\n ${notFoundErrorMessage}`
        : `Transaction for request key "${requestKey}" is failed with : ${error.message}`;
    return {
      status: 'error',
      errors: [errorMessage],
    };
  }
};

export const generateTabularData = (
  chainId: string,
  result: ICommandResult,
): Table => {
  const eventsData = result.events?.map((event) => {
    const { name, module, params } = event;
    const moduleName =
      module.namespace !== null
        ? `${module.namespace}.${module.name}`
        : module.name;
    const eventName = `${moduleName}.${name}`;
    return [`Event:${eventName}`, params.join('\n')];
  });
  const events =
    eventsData === undefined ? [['Events', 'N/A']] : [...eventsData];

  const table = createTable({});

  [
    ['Chain ID', chainId.toString()],
    ['Transaction Status', result.result.status],
    ['Transaction ID', result.txId?.toString() ?? 'N/A'],
    ['Gas', result.gas.toString()],
    ['Block Height', result.metaData?.blockHeight?.toString() ?? 'N/A'],
    ...events,
  ].forEach((x) => table.push(x));

  return table;
};

export const createTxStatusCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'status',
  'Get the status of a transaction',
  [
    txOptions.requestKey(),
    globalOptions.networkSelect({ isOptional: false }),
    globalOptions.chainId(),
    txOptions.poll(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('status-tx:action', config);

    const loader = config.poll
      ? ora('Getting transaction...\n').start()
      : undefined;
    const result = await getTxStatus(config);
    assertCommandError(result, loader);

    const { status } = result.data.result;
    const outputColor = status === 'success' ? log.color.green : log.color.red;
    log.info(outputColor(`Transaction Status: ${status}`));

    if (status === 'failure') {
      const errorMessage =
        'message' in result.data.result.error
          ? result.data.result.error.message
          : result.data.result.error;
      log.info(outputColor(`Error: ${errorMessage}`));
    }

    const table = generateTabularData(config.chainId, result.data);
    log.output(table.toString(), result.data.result);
  },
);
