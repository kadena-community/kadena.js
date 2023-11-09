import { getBalance } from '@kadena/client-utils/coin';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import chalk from 'chalk';

// eslint-disable-next-line @rushstack/typedef-var
export const createGetBalanceCommand = createCommand(
  'get-balance',
  'Get the balance of an account',
  [globalOptions.account(), globalOptions.network(), globalOptions.chainId()],
  async (config) => {
    try {
      const balance = await getBalance(
        config.account,
        config.networkConfig.networkId,
        config.chainId,
        config.networkConfig.networkHost,
      );
      console.log(chalk.green(`\nThe balance of ${config.account} on chain ${config.chainId} on ${config.network} is: ${balance}.\n`));
    } catch (e) {
      console.log(chalk.red(e.message));
    }
  },
);
