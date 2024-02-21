import { createDecryptCommand } from './commands/keysDecrypt.js';
import { createListKeysCommand } from './commands/keysList.js';
import { createGeneratePlainKeysCommand } from './commands/keysPlainGenerate.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'keys' = 'keys';

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);
  createGeneratePlainKeysCommand(keysProgram, version);
  createDecryptCommand(keysProgram, version);
  createListKeysCommand(keysProgram, version);
}
