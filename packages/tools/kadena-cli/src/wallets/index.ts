import { createChangeWalletPasswordCommand } from './commands/walletsChangeWalletPassword.js';
import { createDeleteWalletsCommand } from './commands/walletsDeleteWallet.js';
import { createExportCommand } from './commands/walletsExport.js';
import { createGenerateHdKeysCommand } from './commands/walletsGenerateKey.js';
import { createImportWalletCommand } from './commands/walletsImport.js';
import { createListWalletsCommand } from './commands/walletsList.js';
import { createGenerateWalletCommand } from './commands/walletsWalletGenerate.js';

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
