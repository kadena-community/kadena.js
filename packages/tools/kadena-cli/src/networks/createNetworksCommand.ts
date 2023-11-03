import { defaultNetworksPath } from '../constants/networks.js';
import { network, networkExplorerUrl, networkHost, networkId } from '../constants/options.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { TNetworksCreateOptions } from './networksCreateQuestions.js';
import {
  NetworksCreateOptions,
  networksCreateQuestions,
} from './networksCreateQuestions.js';
import { displayNetworkConfig, writeNetworks } from './networksHelpers.js';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import path from 'path';

async function shouldProceedWithNetworkCreate(
  network: string,
): Promise<boolean> {
  const filePath = path.join(defaultNetworksPath, `${network}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await select({
      message: `Your network (config) already exists. Do you want to update it?`,
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });
    return overwrite === 'yes';
  }
  return true;
}

export async function runNetworksCreate(
  program?: Command,
  version?: string,
  args?: TNetworksCreateOptions,
): Promise<string | void> {
  try {
    const responses = await collectResponses(args || {}, networksCreateQuestions);

    const networkConfig = { ...args, ...responses };

    NetworksCreateOptions.parse(networkConfig);

    writeNetworks(networkConfig);

    displayNetworkConfig(networkConfig);

    const proceed = await select({
      message: 'Is the above network configuration correct?',
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });

    if (proceed === 'no') {
      clearCLI(true);
      console.log(chalk.yellow("Let's restart the configuration process."));
      await runNetworksCreate(program, version, args);
    } else {
      console.log(chalk.green('Network configuration complete!'));
      return networkConfig.network
    }
  } catch (e) {
    console.error(e);
    if (program) {
      processZodErrors(program, e, args);
    }
  }
}

export function createNetworksCommand(program: Command, version: string): void {
  program
    .command('create')
    .description('Create new network')
    .addOption(network)
    .addOption(networkId)
    .addOption(networkHost)
    .addOption(networkExplorerUrl)
    .action(async (args: TNetworksCreateOptions) => {
      debug('network-create:action')({ args });

      if (
        args.network &&
        !(await shouldProceedWithNetworkCreate(args.network.toLowerCase()))
      ) {
        console.log(chalk.red('Network creation aborted.'));
        return;
      }

      await runNetworksCreate(program, version, args);
    });
}
