import { describeModule } from '@kadena/client-utils/built-in';
import chalk from 'chalk';
import { Option } from 'commander';
import debug from 'debug';
import ora from 'ora';
import { z } from 'zod';
import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
import { networkIsAlive } from '../../devnet/utils/network.js';
import { loadNetworkConfig } from '../../networks/utils/networkHelpers.js';
import { actionAskForDeployDevnet } from '../../prompts/genericActionPrompts.js';
import { networkSelectOnlyPrompt } from '../../prompts/network.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { fund } from '../utils/fund.js';

const networkSelect = createOption({
  key: 'network' as const,
  prompt: networkSelectOnlyPrompt,
  validation: z.string(),
  option: new Option(
    '-n, --network <network>',
    'Kadena network (e.g. "mainnet")',
  ),
  expand: async (network: string) => {
    try {
      const networkConfig = loadNetworkConfig(network);
      return networkConfig;
    } catch (e) {
      throw new Error(
        `No network configuration found for "${network}". Please create a "${network}" network.`,
      );
    }
  },
});

const deployDevnet = createOption({
  key: 'deployDevnet',
  validation: z.boolean(),
  prompt: actionAskForDeployDevnet,
  option: new Option('-d, --deploy-devnet', 'Deploy devnet if not available.'),
});

/* bin/kadena-cli.js account fund --account="dev.yaml" --amount="20" --network="devnet" --chain-id="0" */

export const createFundCommand = createCommandFlexible(
  'fund',
  'fund an existing/new account',
  [
    globalOptions.accountSelect(),
    globalOptions.amount(),
    networkSelect(),
    globalOptions.chainId(),
    deployDevnet(),
  ],
  async (option, values) => {
    debug.log('account-fund:action', { values });
    const { accountConfig } = await option.account();
    const { amount } = await option.amount();
    const { network, networkConfig } = await option.network();
    const { chainId } = await option.chainId();

    const config = {
      accountConfig,
      amount,
      chainId,
      networkConfig,
    };

    debug.log('account-fund:action', config);

    if (networkConfig.networkId === 'mainnet01') {
      console.log(
        chalk.red(
          `\nNetwork "${network}" of id "${networkConfig.networkId}" is not supported.\n`,
        ),
      );
      return;
    }

    if (networkConfig.networkId === 'fast-development') {
      if (!(await networkIsAlive(networkConfig.networkHost))) {
        console.log(
          chalk.red(
            `\nDevnet host "${networkConfig.networkHost}" is not running.\n`,
          ),
        );
        return;
      }

      const hasModuleAvailable = await describeModule(FAUCET_MODULE_NAME, {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: { chainId: chainId },
        },
      }).catch(() => false);

      if (hasModuleAvailable === false) {
        console.log(
          chalk.yellow(
            `\nFaucet module is not available on chain "${chainId}" in "${networkConfig.network}".\n`,
          ),
        );

        // TODO: Verify this use case with "ALBERT"
        if (config.accountConfig.fungible !== 'coin') return;

        const { deployDevnet } = await option.deployDevnet();

        if (!deployDevnet) {
          return;
        }

        console.log('\nDeploying faucet...\n');

        await deployDevNetFaucet([chainId]).catch((e) => {
          console.log(
            chalk.red(
              `\nFailed to deploy faucet module on chain "${chainId}" in "${network}".\n`,
            ),
          );
          throw Error(e);
        });
        console.log(
          chalk.green(
            `\nDeployed faucet module on chain "${chainId}" in "${network}".\n`,
          ),
        );
      }
    }

    const loadingSpinner = ora('Funding account...\n').start();

    const result = await fund(config);
    loadingSpinner.stop();
    assertCommandError(result);

    console.log(
      chalk.green(
        `"${accountConfig.name}" account funded with "${amount}" ${accountConfig.fungible} on chain ${chainId} in ${networkConfig.networkId} network.`,
      ),
    );
  },
);
