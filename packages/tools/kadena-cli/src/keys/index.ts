import { createDeleteKeysCommand } from './commands/keysDelete.js';
import { createGenerateFromMnemonic } from './commands/keysGenFromMnemonic.js';
import { createGenerateFromSeedCommand } from './commands/keysGenerateFromSeed.js';
import { createListKeysCommand } from './commands/keysList.js';
import { createManageKeysCommand } from './commands/keysManage.js';
import { createGeneratePlainKeysCommand } from './commands/keysPlainGenerate.js';
import { createGenerateSeedCommand } from './commands/keysSeedGenerate.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'keys' = 'keys';

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);

  createGenerateSeedCommand(keysProgram, version);
  createGeneratePlainKeysCommand(keysProgram, version);
  createGenerateFromSeedCommand(keysProgram, version);
  createGenerateFromMnemonic(keysProgram, version);
  createDeleteKeysCommand(keysProgram, version);
  createManageKeysCommand(keysProgram, version);
  createListKeysCommand(keysProgram, version);
}
