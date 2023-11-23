import { getBalance } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const getBalanceCommand: (program: Command, version: string) => void =
  createCommand(
    'get-balance',
    'Get balance of an account',
    [
      globalOptions.accountName(),
      globalOptions.fungible(),
      globalOptions.network(),
      globalOptions.networkChainId(),
    ],
    async (config) => {
      debug('account-details:action')({ config });

      try {
        const balance = await getBalance(
          config.accountName,
          config.networkConfig.networkId,
          config.chainId as ChainId,
          config.networkConfig.networkHost,
        );
        console.log(
          chalk.green(
            `\nThe balance of "${config.accountName}" on chain ${config.chainId} of ${config.network} is ${balance}\n`,
          ),
        );
      } catch (e) {
        console.log(chalk.red(e.message));
      }
    },
  );
