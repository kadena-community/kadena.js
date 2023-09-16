import type { Context } from '../constants/config';
import { displayConfig, displayContext } from '../utils/display';
import { getConfig, getContext, setContext } from '../utils/globalConfig';
import { collectResponses } from '../utils/helpers';
import { processZodErrors } from '../utils/process-zod-errors';

import { contextQuestions } from './contextOptions';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import clear from 'clear';
import type { Command } from 'commander';
import debug from 'debug';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const ContextOptions = z.object({
  context: z.enum(['mainnet', 'testnet', 'devnet']),
});

export type TContextOptions = z.infer<typeof ContextOptions>;

async function shouldProceedWithChangeContext(): Promise<boolean> {
  displayContext(getContext());
  const overwrite = await select({
    message: `Do you wish to change the current context`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
  return overwrite === 'yes';
}

async function runContextChange(
  program: Command,
  version: string,
  args: TContextOptions,
): Promise<void> {
  try {
    const responses = await collectResponses(args, contextQuestions);

    const finalConfig = { ...args, ...responses };

    ContextOptions.parse(finalConfig);

    if (!finalConfig.context && !(await shouldProceedWithChangeContext())) {
      console.log(chalk.red('Context change aborted.'));
      return;
    }

    await setContext(finalConfig.context as Context);
    clear();
    displayContext(getContext());
    displayConfig(getConfig());

    console.log('Configuration complete. Goodbye!');
  } catch (e) {
    console.log(e);
    processZodErrors(program, e, args);
  }
}

export function contextCommand(program: Command, version: string): void {
  program
    .command('update-context')
    .description('Update the context of your curent context.')
    .option('-ctx, --context <context>', 'Set your context')
    .action(async (args: TContextOptions) => {
      debug('init:action')({ args });

      await runContextChange(program, version, args);
    });
}
