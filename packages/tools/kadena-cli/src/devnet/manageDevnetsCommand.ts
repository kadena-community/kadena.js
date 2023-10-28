import { defaultDevnetsPath } from '../constants/devnets.js';
import {
  clearCLI,
  collectResponses,
  getExistingDevnets,
} from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { TDevnetsCreateOptions } from './devnetsCreateQuestions.js';
import {
  devnetManageQuestions,
  DevnetsCreateOptions,
} from './devnetsCreateQuestions.js';
import type { ICustomDevnetsChoice } from './devnetsHelpers.js';
import { writeDevnets } from './devnetsHelpers.js';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export interface IManageDevnetsOptions {}

export function manageDevnets(program: Command, version: string): void {
  program
    .command('manage')
    .description('Manage devnet(s)')
    .action(async (args: IManageDevnetsOptions) => {
      try {
        const existingDevnets: ICustomDevnetsChoice[] = getExistingDevnets();

        if (existingDevnets.length === 0) {
          console.log(chalk.red('No existing devnets found.'));
          return;
        }

        const selectedDevnet = await select({
          message: 'Select the devnet you want to manage:',
          choices: existingDevnets,
        });
        const devnetFilePath = path.join(
          defaultDevnetsPath,
          `${selectedDevnet}.yaml`,
        );
        const existingConfig: TDevnetsCreateOptions = yaml.load(
          readFileSync(devnetFilePath, 'utf8'),
        ) as TDevnetsCreateOptions;

        const responses = await collectResponses(
          { name: selectedDevnet },
          devnetManageQuestions,
        );
        const devnetConfig = { ...existingConfig, ...responses };

        DevnetsCreateOptions.parse(devnetConfig);

        writeDevnets(devnetConfig);
        clearCLI();
        console.log(chalk.green('Devnet configurations updated.'));
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
