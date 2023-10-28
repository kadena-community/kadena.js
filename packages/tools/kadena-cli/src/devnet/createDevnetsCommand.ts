import { defaultDevnetsPath } from '../constants/devnets.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import type { TDevnetsCreateOptions } from './devnetsCreateQuestions.js';
import {
  DevnetsCreateOptions,
  devnetsCreateQuestions,
} from './devnetsCreateQuestions.js';
import { displayDevnetConfig, writeDevnets } from './devnetsHelpers.js';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { Option, type Command } from 'commander';
import debug from 'debug';
import path from 'path';

async function shouldProceedWithDevnetCreate(devnet: string): Promise<boolean> {
  const filePath = path.join(defaultDevnetsPath, `${devnet}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await select({
      message: `Your devnet (config) already exists. Do you want to update it?`,
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });
    return overwrite === 'yes';
  }
  return true;
}

export async function runDevnetsCreate(
  program: Command,
  version: string,
  args: TDevnetsCreateOptions,
): Promise<void> {
  try {
    const responses = await collectResponses(args, devnetsCreateQuestions);

    const devnetConfig = { ...args, ...responses };

    DevnetsCreateOptions.parse(devnetConfig);

    writeDevnets(devnetConfig);

    displayDevnetConfig(devnetConfig);

    const proceed = await select({
      message: 'Is the above devnet configuration correct?',
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });

    if (proceed === 'no') {
      clearCLI(true);
      console.log(chalk.yellow("Let's restart the configuration process."));
      await runDevnetsCreate(program, version, args);
    } else {
      console.log(chalk.green('Configuration complete. Goodbye!'));
    }
  } catch (e) {
    console.error(e);
    processZodErrors(program, e, args);
  }
}

export function createDevnetsCommand(program: Command, version: string): void {
  program
    .command('create')
    .description('Create new devnet')
    .option('-n, --name <name>', 'Container name (e.g. "devnet")')
    .addOption(
      new Option(
        '-p, --port <port>',
        'Port to forward to the Chainweb node API (e.g. 8080)',
      ).argParser((value) => parseInt(value, 10)),
    )
    .option(
      '-u, --useVolume',
      'Create a persistent volume to mount to the container',
    )
    .option(
      '-m, --mountPactFolder <mountPactFolder>',
      'Mount a folder containing Pact files to the container (e.g. "./pact")',
    )
    .option(
      '-v, --version <version>',
      'Version of the kadena/devnet Docker image to use (e.g. "latest")',
    )
    .action(async (args: TDevnetsCreateOptions) => {
      debug('devnet-create:action')({ args });

      if (
        args.name &&
        !(await shouldProceedWithDevnetCreate(args.name.toLowerCase()))
      ) {
        console.log(chalk.red('Devnet creation aborted.'));
        return;
      }

      await runDevnetsCreate(program, version, args);
    });
}
