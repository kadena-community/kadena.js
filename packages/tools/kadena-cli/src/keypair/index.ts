import type { Command } from 'commander';
import { createKeypairCommand } from './createKeypairCommand.js';
import { deleteKeypairCommand } from './deleteKeypairCommand.js';
import { listKeypairsCommand } from './listKeypairsCommand.js';
const SUBCOMMAND_ROOT: 'keypair' = 'keypair';

export function keypairCommandFactory(program: Command, version: string): void {
  const keypairProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to manage keypairs`);

  listKeypairsCommand(keypairProgram, version);
  createKeypairCommand(keypairProgram, version);
  deleteKeypairCommand(keypairProgram, version);
}
