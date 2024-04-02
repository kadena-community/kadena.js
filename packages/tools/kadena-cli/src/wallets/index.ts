import { createGenerateWalletCommand } from './commands/walletAdd.js';
import { createChangeWalletPasswordCommand } from './commands/walletChangePassword.js';
import { createDeleteWalletsCommand } from './commands/walletDelete.js';
import { createExportCommand } from './commands/walletExport.js';
import { createGenerateHdKeysCommand } from './commands/walletGenerateKey.js';
import { createImportWalletCommand } from './commands/walletImport.js';
import { createListWalletsCommand } from './commands/walletList.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'wallet' = 'wallet';

export function walletsCommandFactory(program: Command, version: string): void {
  const walletsProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage wallets`);
  createGenerateWalletCommand(walletsProgram, version);
  createImportWalletCommand(walletsProgram, version);
  createGenerateHdKeysCommand(walletsProgram, version);
  createChangeWalletPasswordCommand(walletsProgram, version);
  createExportCommand(walletsProgram, version);
  createDeleteWalletsCommand(walletsProgram, version);
  createListWalletsCommand(walletsProgram, version);
}
