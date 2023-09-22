import { createSimpleSubCommand } from '../utils/helpers';

import { generateKeys } from './generateKeysCommand';
import type { IListKeysArgs } from './listKeysCommand';
import { listKeysAction } from './listKeysCommand';
import { manageKeys } from './manageKeysCommand';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'keys' = 'keys';

export function keysCommandFactory(program: Command, version: string): void {
  const keysProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to generate and manage keys`);

  createSimpleSubCommand<IListKeysArgs>(
    'list-keys',
    'List all keys',
    listKeysAction,
  )(keysProgram);

  manageKeys(keysProgram, version);
  generateKeys(keysProgram, version);
}
