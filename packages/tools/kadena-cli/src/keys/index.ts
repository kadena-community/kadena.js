import { createChangeWalletPasswordCommand } from './commands/keysChangeWalletPassword.js';
import { createDecryptCommand } from './commands/keysDecrypt.js';
import { createDeleteKeysCommand } from './commands/keysDeleteWallet.js';
import { createGenerateHdKeysCommand } from './commands/keysHdGenerate.js';
import { createImportWalletCommand } from './commands/keysImportWallet.js';
import { createListKeysCommand } from './commands/keysList.js';
import { createGeneratePlainKeysCommand } from './commands/keysPlainGenerate.js';
import { createGenerateWalletsCommand } from './commands/keysWalletGenerate.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'keys' = 'keys';

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);
  createGenerateWalletsCommand(keysProgram, version);
  createImportWalletCommand(keysProgram, version);
  createGenerateHdKeysCommand(keysProgram, version);
  createGeneratePlainKeysCommand(keysProgram, version);
  createChangeWalletPasswordCommand(keysProgram, version);
  createDeleteKeysCommand(keysProgram, version);
  createDecryptCommand(keysProgram, version);
  createListKeysCommand(keysProgram, version);
}
