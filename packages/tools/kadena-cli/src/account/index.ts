import type { Command } from 'commander';

import { createAddAccountFromWalletCommand } from './commands/accountAddFromWallet.js';
import { createAddAccountManualCommand } from './commands/accountAddManual.js';
import { createAccountCommand } from './commands/accountCreate.js';
import { createAccountDetailsCommand } from './commands/accountDetails.js';
import { fundCommand } from './commands/accountFund.js';
import { getBalanceCommand } from './commands/accountGetBalance.js';
import { resolveAddressToNameCommand } from './commands/accountResolveAddressToName.js';
import { resolveNameToAddressCommand } from './commands/accountResolveNameToAddress.js';
import { transferCreateCommand } from './commands/accountTransferCreate.js';

const SUBCOMMAND_ROOT: 'account' = 'account';

export function accountCommandFactory(program: Command, version: string): void {
  const accountProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);

  createAddAccountManualCommand(accountProgram, version);
  createAddAccountFromWalletCommand(accountProgram, version);
  createAccountCommand(accountProgram, version);
  fundCommand(accountProgram, version);
  createAccountDetailsCommand(accountProgram, version);
  getBalanceCommand(accountProgram, version);
  transferCreateCommand(accountProgram, version);
  resolveNameToAddressCommand(accountProgram, version);
  resolveAddressToNameCommand(accountProgram, version);
}
