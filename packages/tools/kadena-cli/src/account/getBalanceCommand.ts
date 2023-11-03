import {
  collectResponses,
} from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { Command } from 'commander';
import { ZodError, unknown, z } from 'zod';

import { account, chainId, network, networkId } from '../constants/options.js';
import { accountPrompt, chainIdPrompt, networkPrompt } from '../constants/prompts.js';
import { Questions } from '../constants/questions.js';
import { displayNetworkConfig, loadNetworkConfig } from '../networks/networksHelpers.js';

import { Pact, createClient } from '@kadena/client';
import { getBalance } from '@kadena/client-utils/coin';

import chalk from 'chalk';
import { ChainId } from '@kadena/types';

const GetBalanceQuestions = Questions.pick({
  account: true,
  network: true,
  chainId: true,
});

type TGetBalanceQuestions = z.infer<typeof GetBalanceQuestions>;

export function getBalanceCommand(program: Command, version: string): void {
  program
    .command('get-balance')
    .description('get the balance of an account')
    .addOption(account)
    .addOption(network)
    .addOption(chainId)
    .action(async (args: TGetBalanceQuestions) => {
      try {
        const responses = await collectResponses(args, [
          { key: 'account', prompt: accountPrompt },
          { key: 'network', prompt: networkPrompt },
          { key: 'chainId', prompt: chainIdPrompt },
        ]);

        const configuration: TGetBalanceQuestions = {
          ...args,
          ...responses,
        };

        GetBalanceQuestions.parse(configuration);

        // Display full configuration
        // console.log(chalk.green(configuration));

        // Display full command for reuse

        await makeGetBalanceRequest(configuration.account, configuration.network, configuration.chainId);
      } catch (e) {
        if (e instanceof ZodError) {
          processZodErrors(program, e, args);
          return;
        }
        throw e;
      }
    });
}

const makeGetBalanceRequest = async (account: string, network: string, chainId: number) => {
  const networkConfiguration = loadNetworkConfig(network);
  displayNetworkConfig(networkConfiguration);
  const balance = await getBalance(
    account,
    networkConfiguration.networkId || '',
    (chainId.toString() || '0') as ChainId,
    networkConfiguration.networkHost,
  )
  console.log(chalk.green(`The balance of ${account} on chain ${chainId} of ${network} is ${balance}`));
};
