import { processZodErrors } from '../utils/process-zod-errors';

import { Command } from 'commander';

export interface IContractRetrieveOptions {}

export function retrieveCommand(program: Command, version: string): void {
  program
    .command('retrieve')
    .description('download a smart-contract using the /local call')
    .action((args: IContractRetrieveOptions) => {
      try {
        // TODO: use @inquirer/prompts to interactively get missing flags
        // TODO: create zod validator
        // Options.parse(args);
      } catch (e) {
        processZodErrors(program, e, args);
      }

      // TODO: implement `kda contract retrieve`
      throw new Error('Not Implemented Yet');
    });
}
