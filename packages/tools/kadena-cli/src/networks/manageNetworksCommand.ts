import { defaultNetworksPath } from '../constants/networks';
import { collectResponses, getExistingNetworks } from '../utils/helpers';
import { processZodErrors } from '../utils/processZodErrors';

import type { TNetworksCreateOptions } from './networksCreateQuestions';
import {
  networkManageQuestions,
  NetworksCreateOptions,
} from './networksCreateQuestions';
import type { ICustomNetworksChoice } from './networksHelpers';
import { writeNetworks } from './networksHelpers';

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
          chalk.red('No existing networks found.');
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
        console.log('Network configurations updated.');
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
