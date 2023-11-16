import { generateFromHdKeysCommand } from './generateFromHdKeysCommand.js';
import { generateHdKeysCommand } from './generateHdKeysCommand.js';
import { generatePlainKeysCommand } from './generatePlainKeysCommand.js';
import { generateKeySet } from './keyset/index.js';
import { listKeys } from './listKeysCommand.js';
import { manageKeys } from './manageKeysCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'keys' = 'keys';

export function generate(program: Command, version: string): void {
  const generateProgram = program
    .command('generate')
    .description(`Generate keys`);

  generateHdKeysCommand(generateProgram, version);
  generateFromHdKeysCommand(generateProgram, version);
  generatePlainKeysCommand(generateProgram, version);
  generateKeySet(generateProgram, version);
}

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);

  generate(keysProgram, version);
  listKeys(keysProgram, version);
  manageKeys(keysProgram, version);
}
