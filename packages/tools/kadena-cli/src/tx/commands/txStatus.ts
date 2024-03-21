import type { ChainId, ICommandResult } from '@kadena/client';
import { createClient } from '@kadena/client';
import type { Command } from 'commander';
import ora from 'ora';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';

export const getTxStatus = async (config: {
  requestKey: string;
  chainId: ChainId;
  networkConfig: INetworkCreateOptions;
}): Promise<CommandResult<ICommandResult>> => {
  try {
    const { pollStatus } = createClient(
      `${config.networkConfig.networkHost}/chainweb/0.0/${config.networkConfig.networkId}/chain/${config.chainId}/pact`,
    );
    const result = await pollStatus(
      {
        requestKey: config.requestKey,
        chainId: config.chainId,
        networkId: config.networkConfig.networkId,
      },
      { timeout: 25000 },
    );

    return {
      status: 'success',
      data: result[config.requestKey],
    };
  } catch (error) {
    const errorMessage =
      error.message === 'TIME_OUT_REJECT'
        ? `Transaction request for ${config.requestKey} is timed out. Please check your "chainID" input and try again.`
        : `Transaction request for ${config.requestKey} is failed with : ${error.message}`;
    return {
      status: 'error',
      errors: [errorMessage],
    };
  }
};

export const generateTabularData = (
  chainId: string,
  result: ICommandResult,
): { header: string[]; rows: string[][] } => {
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

  const data = [
    ['Chain ID', chainId.toString()],
    ['Transaction Status', result.result.status],
    ['Transaction ID', result.txId?.toString() ?? 'N/A'],
    ['Gas', result.gas.toString()],
    ['Block Height', result.metaData?.blockHeight?.toString() ?? 'N/A'],
    ...events,
  ];

  return {
    // Currently based on header only the columns are aligned.
    // So adding empty header to keep the column alignment.
    header: ['', ''],
    rows: data,
  };
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
  ],
  async (option, { collect }) => {
    log.debug('status-tx:action');

    const config = await collect(option);

    const loader = ora('Getting transaction...\n').start();

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

    const { header, rows } = generateTabularData(config.chainId, result.data);
    log.output(log.generateTableString(header, rows));
  },
);
