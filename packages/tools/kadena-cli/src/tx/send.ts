import { processZodErrors } from '../utils/processZodErrors';

import type { Command } from 'commander';

export interface ISendOptions {}

export function sendCommand(program: Command, version: string): void {
  program
    .command('send')
    .description('send a transaction to the blockchain')
    .action((args: ISendOptions) => {
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
