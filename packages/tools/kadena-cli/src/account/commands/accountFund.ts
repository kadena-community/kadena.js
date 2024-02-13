import chalk from 'chalk';
import debug from 'debug';
import ora from 'ora';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { fund } from '../utils/fund.js';

/* bin/kadena-cli.js account fund --account="dev.yaml" --amount="20" --network="devnet" --chain-id="0" */

export const createFundCommand = createCommandFlexible(
  'fund',
  'fund an existing/new account',
  [
    globalOptions.accountSelect(),
    globalOptions.amount(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
  ],
  async (option, values) => {
    debug.log('account-fund:action', { values });
    const { accountConfig } = await option.account();
    const { amount } = await option.amount();
    const { network, networkConfig } = await option.network({
      allowedNetworkIds: ['testnet04'],
    });
    const { chainId } = await option.chainId();

    const config = {
      accountConfig,
      amount,
      chainId,
      networkConfig,
    };

    debug.log('account-fund:action', config);

    if (['mainnet01', 'fast-development'].includes(networkConfig.networkId)) {
      console.log(
        chalk.red(
          `\nNetwork "${network}" of id "${networkConfig.networkId}" is not supported.\n`,
        ),
      );
      return;
    }

    const loader = ora('Funding account...\n').start();

    const result = await fund(config);
    assertCommandError(result, loader);

    console.log(
      chalk.green(
        `"${accountConfig.name}" account funded with "${amount}" ${accountConfig.fungible} on chain ${chainId} in ${networkConfig.networkId} network.`,
      ),
    );
  },
);
