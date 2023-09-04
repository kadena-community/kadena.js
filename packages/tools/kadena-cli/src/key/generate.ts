import { processZodErrors } from '../utils/process-zod-errors';

import { Command } from 'commander';

export interface IGenerateOptions {}

export function generate(program: Command, version: string): void {
  program
    .command('generate')
    .description('generate an HD-key or public-private key-pair')
    .action((args: IGenerateOptions) => {
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
