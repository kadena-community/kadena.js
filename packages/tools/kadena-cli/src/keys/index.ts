import { createDeleteKeysCommand } from './commands/keysDelete.js';
import { createListKeysCommand } from './commands/keysList.js';
import { createGeneratePlainKeysCommand } from './commands/keysPlainGenerate.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'key' = 'key';

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);
  createGeneratePlainKeysCommand(keysProgram, version);
  createDeleteKeysCommand(keysProgram, version);
  createListKeysCommand(keysProgram, version);
}
