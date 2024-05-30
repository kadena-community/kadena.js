import { createTransactionCommandNew } from './commands/txCreateTransaction.js';
import { createTxListCommand } from './commands/txList.js';
import { createTxLocalCommand } from './commands/txLocal.js';
import { createSendTransactionCommand } from './commands/txSend.js';
import { createSignCommand } from './commands/txSign.js';
import { createTxStatusCommand } from './commands/txStatus.js';
import { createTestSignedTransactionCommand } from './commands/txTestSignedTransaction.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  createTransactionCommandNew(txProgram, version);
  createSignCommand(txProgram, version);
  createTestSignedTransactionCommand(txProgram, version);
  createSendTransactionCommand(txProgram, version);
  createTxStatusCommand(txProgram, version);
  createTxListCommand(txProgram, version);
  createTxLocalCommand(txProgram, version);
}
