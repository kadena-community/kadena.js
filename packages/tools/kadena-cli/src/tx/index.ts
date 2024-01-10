import { createSendTransactionCommand } from './commands/txSend.js';
import { createSignTransactionCommand } from './commands/txSign.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  createSendTransactionCommand(txProgram, version);
  createSignTransactionCommand(txProgram, version);
}
