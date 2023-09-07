import { processZodErrors } from '../utils/process-zod-errors';

import { Command } from 'commander';

export interface IStoreOptions {}

export function storeCommand(program: Command, version: string): void {
  program
    .command('store')
    .description('store')
    .option('-p, --provider <storageProvider>')
    .action((args: IStoreOptions) => {
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
