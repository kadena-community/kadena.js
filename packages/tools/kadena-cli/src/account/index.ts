import { fundCommand } from './fundCommand.js';

import type { Command } from 'commander';
import { createGetBalanceCommand } from './getBalanceCommand.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  fundCommand(accountProgram, version);
  // getBalanceCommand(accountProgram, version);
  createGetBalanceCommand(accountProgram, version);
}
