import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const accountDetailsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'details',
  'Get details of an account',
  [
    globalOptions.accountName(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.networkChainId(),
  ],
  async (config) => {
    debug('account-details:action')({ config });

    try {
      const accountDetails = await details(
        config.accountName,
        config.networkConfig.networkId,
        config.chainId as ChainId,
        config.networkConfig.networkHost,
      );
      console.log(
        chalk.green(`\nDetails of account "${config.accountName}":\n`),
      );
      console.log(accountDetails);
    } catch (e) {
      console.log(chalk.red(e.message));
    }
  },
);
