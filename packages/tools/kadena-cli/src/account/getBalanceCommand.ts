import {
  collectResponses,
  createCommand,
  createSimpleSubCommand,
  globalOptions,
} from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { Command } from 'commander';
import { ZodError, unknown, z } from 'zod';

import { account, chainId, network } from '../constants/options.js';
import {
  accountPrompt,
  chainIdPrompt,
  networkPrompt,
} from '../constants/prompts.js';
import { Questions } from '../constants/questions.js';
import {
  displayNetworkConfig,
  loadNetworkConfig,
} from '../networks/networksHelpers.js';

import { getBalance } from '@kadena/client-utils/coin';

import { ChainId } from '@kadena/types';
import chalk from 'chalk';

// eslint-disable-next-line @rushstack/typedef-var
export const createGetBalanceCommand = createCommand(
  'get-balance',
  'get the balance of an account',
  [globalOptions.account(), globalOptions.network(), globalOptions.chainId()],
  async (config) => {
    // console.log('config', JSON.stringify(config, null, 2))

    const balance = await getBalance(
      config.account,
      config.networkConfig.networkId,
      config.chainId,
      config.networkConfig.networkHost,
    );
    console.log({ balance });
    return balance;
  },
);

// export const createGetBalanceCommand = createSimpleSubCommand(
//   'account',
//   'get-balance',
//   'get the balance of an account',
//   [
//     { key: 'account' },
//     { key: 'network', optional: true },
//     { key: 'chainId' },
//   ]
// )(program, version)(async (config) => {
//   await makeGetBalanceRequest(config.account, config.network, config.chainId);
// })

// const makeGetBalanceRequest = async (account: string, network: string, chainId: number) => {
//   const networkConfiguration = loadNetworkConfig(network);
//   displayNetworkConfig(networkConfiguration);
//   const balance = await getBalance(
//     account,
//     networkConfiguration.networkId || '',
//     (chainId.toString() || '0') as ChainId,
//     networkConfiguration.networkHost,
//   )
//   console.log(chalk.green(`The balance of ${account} on chain ${chainId} of ${network} is ${balance}`));
// };
