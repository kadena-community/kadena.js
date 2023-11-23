import type { Command } from 'commander';
import { createAccountCommand } from './commands/accountCreate.js';
import { accountDetailsCommand } from './commands/accountDetails.js';
import { getBalanceCommand } from './commands/accountGetBalance.js';
import { transferCreateCommand } from './commands/accountTransferCreate.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  createAccountCommand(accountProgram, version);
  accountDetailsCommand(accountProgram, version);
  getBalanceCommand(accountProgram, version);
  transferCreateCommand(accountProgram, version);
}
