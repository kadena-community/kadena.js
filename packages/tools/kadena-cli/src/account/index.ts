import type { Command } from 'commander';

import { createAddAccountCommand } from './commands/accountAdd.js';
import { createAccountCreateCommand } from './commands/accountCreate.js';
import { createAccountDeleteCommand } from './commands/accountDelete.js';
import { createAccountDetailsCommand } from './commands/accountDetails.js';
import { createAccountFundCommand } from './commands/accountFund.js';
import { createAccountListCommand } from './commands/accountList.js';
import { createResolveAddressToNameCommand } from './commands/accountResolveAddressToName.js';
import { createResolveNameToAddressCommand } from './commands/accountResolveNameToAddress.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  createAddAccountCommand(accountProgram, version);
  createAccountCreateCommand(accountProgram, version);
  createAccountDeleteCommand(accountProgram, version);
  createAccountDetailsCommand(accountProgram, version);
  createAccountFundCommand(accountProgram, version);
  createAccountListCommand(accountProgram, version);
  createResolveNameToAddressCommand(accountProgram, version);
  createResolveAddressToNameCommand(accountProgram, version);
}
