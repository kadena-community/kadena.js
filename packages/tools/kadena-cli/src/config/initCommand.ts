import type { Context } from '../constants/config';
import {  rootPath } from '../constants/config';
import { displayConfig } from '../utils/display';
import { ensureFileExists } from '../utils/filesystem';
import { getConfig, setContext, writeConfig } from '../utils/globalConfig';
import { collectResponses } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import type {
  TConfigOptions} from './configOptions';
import {
  GeneralOptions,
  generalQuestions
} from './configOptions';

import { select } from '@inquirer/prompts';
import clear from 'clear';
import type { Command} from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import path from 'path';

async function shouldProceedWithConfigInit(): Promise<boolean> {
  const filePath = path.join(rootPath, 'config.yaml');
  if (ensureFileExists(filePath)) {
    const overwrite = await select({
      message: `Your config already exists. Do you want to update it?`,
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });
    return overwrite === 'yes';
  }
  return true;
}

async function runConfigInitialization(
  program: Command,
  version: string,
  args: TConfigOptions,
): Promise<void> {
  try {
    const responses = await collectResponses(args, generalQuestions);

    const finalConfig = { ...args, ...responses };

    GeneralOptions.parse(finalConfig);

    writeConfig(finalConfig);

    await setContext(finalConfig.context as Context);
    displayConfig(getConfig());

    const proceed = await select({
      message: 'Is the above configuration correct?',
      choices: [
        { value: 'yes', name: 'Yes' },
        { value: 'no', name: 'No' },
      ],
    });

    if (proceed === 'no') {
      clear(true);
      console.log("Let's restart the configuration process.");
      await runConfigInitialization(program, version, args);
    } else {
      console.log('Configuration complete. Goodbye!');
    }
  } catch (e) {
    console.log(e);
    processZodErrors(program, e, args);
  }
}

export function initCommand(program: Command, version: string): void {
  program
    .command('init')
    .description('configuration of the CLI. E.g. network, config directory.')
    .option('-ctx, --context <context>', 'Set your context')
    .option('-pb, --publicKey <publicKey>', 'Set your publicKey')
    .option('-pr, --privateKey <privateKey>', 'Set your privateKey')
    .addOption(
      new Option('-c, --chainId <number>', 'Chain to retrieve from (default 1)')
        .argParser((value) => parseInt(value, 10))
        .default(1),
    )
    .option(
      '-nid, --networkId <networkId>',
      'Kadena network Id (e.g. "mainnet01")',
    )
    .option(
      '-h, --networkHost <networkHost>',
      'Kadena network host (e.g. "https://api.chainweb.com")',
    )
    .option(
      '-e, --networkExplorerUrl <networkExplorerUrl>',
      'Kadena network explorer (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
    )
    .option(
      '-kdn, --kadenaNamesApiEndpoint <kadenaNamesApiEndpoint>',
      'Kadena Names Api (e.g. "https://www.kadenanames.com/api/v1")',
    )
    .action(async (args: TConfigOptions) => {
      debug('init:action')({ args });

      if (!(await shouldProceedWithConfigInit())) {
        console.log('Config initialization aborted.');
        return;
      }

      await runConfigInitialization(program, version, args);
    });
}
