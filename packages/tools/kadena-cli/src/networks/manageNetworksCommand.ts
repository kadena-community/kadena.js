import { defaultNetworksPath } from '../constants/networks.js';
import {
  clearCLI,
  collectResponses,
  getExistingNetworks,
} from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { TNetworksCreateOptions } from './networksCreateQuestions.js';
import {
  networkManageQuestions,
  NetworksCreateOptions,
} from './networksCreateQuestions.js';
import type { ICustomNetworksChoice } from './networksHelpers.js';
import { writeNetworks } from './networksHelpers.js';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export interface IManageNetworksOptions {}

export function manageNetworks(program: Command, version: string): void {
  program
    .command('manage')
    .description('Manage network(s)')
    .action(async (args: IManageNetworksOptions) => {
      try {
        const existingNetworks: ICustomNetworksChoice[] = getExistingNetworks();

        if (existingNetworks.length === 0) {
          console.log(chalk.red('No existing networks found.'));
          return;
        }

        const selectedNetwork = await select({
          message: 'Select the network you want to manage:',
          choices: existingNetworks,
        });
        const networkFilePath = path.join(
          defaultNetworksPath,
          `${selectedNetwork}.yaml`,
        );
        const existingConfig: TNetworksCreateOptions = yaml.load(
          readFileSync(networkFilePath, 'utf8'),
        ) as TNetworksCreateOptions;

        const responses = await collectResponses(
          { network: selectedNetwork },
          networkManageQuestions,
        );
        const networkConfig = { ...existingConfig, ...responses };

        NetworksCreateOptions.parse(networkConfig);

        writeNetworks(networkConfig);
        clearCLI();
        console.log(chalk.green('Network configurations updated.'));
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
