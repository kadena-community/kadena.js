import { processZodErrors } from '../utils/processZodErrors.js';

import type { Command } from 'commander';

export interface IManageKeysOptions {}

export function manageKeys(program: Command, version: string): void {
  program
    .command('manage')
    .description('Manage key(s)')
    .action((args: IManageKeysOptions) => {
      try {
        // TODO: use @inquirer/prompts to interactively get missing flags
        // TODO: create zod validator
        // Options.parse(args);
      } catch (e) {
        processZodErrors(program, e, args);
      }

      // TODO: implement
      throw new Error('Not Implemented Yet');
    });
}
