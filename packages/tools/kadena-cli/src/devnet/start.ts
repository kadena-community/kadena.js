import { processZodErrors } from '../utils/process-zod-errors';

import type { Command } from 'commander';

export interface IStartOptions {}

export function startCommand(program: Command, version: string): void {
  program
    .command('start')
    .description('start the local devnet')
    .action((args: IStartOptions) => {
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
