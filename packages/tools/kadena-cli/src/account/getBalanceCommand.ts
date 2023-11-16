import { getBalance } from '@kadena/client-utils/coin';
import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';

// eslint-disable-next-line @rushstack/typedef-var
export const getBalanceCommand = createCommand(
  'get-balance',
  'Get the balance of an account',
  [globalOptions.account(), globalOptions.network(), globalOptions.chainId()],
  async (config) => {
    // const config = bla as unknown as {} as any;
    try {
      const balance = await getBalance(
        config.accountConfig.account,
        config.networkConfig.networkId,
        config.chainId,
        config.networkConfig.networkHost,
      );
      console.log(
        chalk.green(
          `\nThe balance of ${config.account} on chain ${config.chainId} on ${config.network} is: ${balance}.\n`,
        ),
      );
    } catch (e) {
      console.log(chalk.red(e.message));
    }
  },
);
