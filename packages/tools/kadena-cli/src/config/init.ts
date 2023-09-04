import { processZodErrors } from '../cli-utils/process-zod-errors';

import { Command } from 'commander';

export interface IContractGenerateOptions {}

export function initCommand(program: Command, version: string): void {
  program
    .command('init')
    .description('create `.kadena/` directory with `config.yaml`')
    .action((args: IContractGenerateOptions) => {
      try {
        // TODO: use @inquirer/prompts to interactively get missing flags
        // TODO: create zod validator
        // Options.parse(args);
      } catch (e) {
        processZodErrors(program, e, args);
      }

      // TODO: implement `kda config init`
      throw new Error('Not Implemented Yet');
    });
}
