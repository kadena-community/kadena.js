import { processZodErrors } from '../utils/processZodErrors';

import type { Command } from 'commander';

export interface IGenerateKeysOptions {}

export function generateKeys(program: Command, version: string): void {
  program
    .command('generate')
    .description('generate an HD-key or public-private key-pair')
    .action((args: IGenerateKeysOptions) => {
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
