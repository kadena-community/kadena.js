import type { Command } from 'commander';
import { createKeysetCommand } from './createKeysetCommand.js';
import { deleteKeysetCommand } from './deleteKeysetCommand.js';
import { listKeysetsCommand } from './listKeysetsCommand.js';
const SUBCOMMAND_ROOT: 'keyset' = 'keyset';

export function keysetCommandFactory(program: Command, version: string): void {
  const keysetProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage keysets`);

  listKeysetsCommand(keysetProgram, version);
  createKeysetCommand(keysetProgram, version);
  deleteKeysetCommand(keysetProgram, version);
}
