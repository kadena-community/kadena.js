import { fundCommand } from './fundCommand.js';

import type { Command } from 'commander';
import { getBalanceCommand } from './getBalanceCommand.js';
import { createAccountCommand } from './createAccountCommand.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  createAccountCommand(accountProgram, version);
  fundCommand(accountProgram, version);
  getBalanceCommand(accountProgram, version);
}
