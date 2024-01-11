import { createSendTransactionCommand } from './commands/txSend.js';
import { createSignTransactionWithAliasFileCommand } from './commands/txSignWithAliasFile.js';
import { createSignTransactionWithChainweaver } from './commands/txSignWithChainweaver.js';
import { createSignTransactionWithKeypairCommand } from './commands/txSignWithKeypair.js';
import { createSignTransactionWithLocalWalletCommand } from './commands/txSignWithLocalWallet.js';
import { createSignTransactionWithWalletConnect } from './commands/txSignWithWalletConnect.js';
import { createSignTransactionWithWebAuthN } from './commands/txSignWithWebAuthN.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  createSendTransactionCommand(txProgram, version);
  createSignTransactionWithKeypairCommand(txProgram, version);
  createSignTransactionWithAliasFileCommand(txProgram, version);
  createSignTransactionWithLocalWalletCommand(txProgram, version);
  createSignTransactionWithWalletConnect(txProgram, version);
  createSignTransactionWithChainweaver(txProgram, version);
  createSignTransactionWithWebAuthN(txProgram, version);
}
