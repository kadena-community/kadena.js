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
    const { listen } = createClient(
      `${config.networkConfig.networkHost}/chainweb/0.0/${config.networkConfig.networkId}/chain/${config.chainId}/pact`,
    );
    const result = await listen({
      requestKey: config.requestKey,
      chainId: config.chainId,
      networkId: config.networkConfig.networkId,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }
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
    if (status === 'success') {
      log.info(outputColor(`Data: ${result.data.result.data}`));
    } else {
      const errorMessage =
        'message' in result.data.result.error
          ? result.data.result.error.message
          : result.data.result.error;
      log.info(outputColor(`Error: ${errorMessage}`));
    }
  },
);
