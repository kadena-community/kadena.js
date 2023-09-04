import { processZodErrors } from '../utils/process-zod-errors';

import { Command } from 'commander';

export interface IFundOptions {}

export function fundCommand(program: Command, version: string): void {
  program
    .command('fund')
    .description('fund an account on a devnet or testnet')
    .action((args: IFundOptions) => {
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
