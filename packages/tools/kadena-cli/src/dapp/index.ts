import type { Command } from 'commander';

import { createDappCommand } from './commands/dappCreate.js';

const SUBCOMMAND_ROOT: 'dapp' = 'dapp';

export function dappCommandFactory(program: Command, version: string): void {
  const dappProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for managing dapp projects`)
    .arguments('<project-directory>');

  createDappCommand(dappProgram, version);
}
