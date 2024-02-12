import type { Command } from 'commander';

import { createAddAccountFromWalletCommand } from './commands/accountAddFromWallet.js';
import { createAddAccountManualCommand } from './commands/accountAddManual.js';
import { createAccountDetailsCommand } from './commands/accountDetails.js';
import { createFundCommand } from './commands/accountFund.js';
import { resolveAddressToNameCommand } from './commands/accountResolveAddressToName.js';
import { resolveNameToAddressCommand } from './commands/accountResolveNameToAddress.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  createAddAccountManualCommand(accountProgram, version);
  createAddAccountFromWalletCommand(accountProgram, version);
  createAccountDetailsCommand(accountProgram, version);
  createFundCommand(accountProgram, version);
  resolveNameToAddressCommand(accountProgram, version);
  resolveAddressToNameCommand(accountProgram, version);
}
