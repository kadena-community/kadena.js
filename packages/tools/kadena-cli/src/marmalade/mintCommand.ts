import { processZodErrors } from '../utils/processZodErrors';

import type { Command } from 'commander';

export interface IMintOptions {}

export function mintCommand(program: Command, version: string): void {
  program
    .command('mint')
    .description('mint a new NFT on Marmalade')
    .action((args: IMintOptions) => {
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
