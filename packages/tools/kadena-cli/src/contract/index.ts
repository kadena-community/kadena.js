import { deployCommand } from './deployCommand.js';
import { retrieveCommand } from './retrieveCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'contract' = 'contract';

/**
 * Create subcommand `kadena contract`
 * `kadena contract retrieve`
 * `kadena contract deploy`
 */
export function contractCommandFactory(
  program: Command,
  version: string,
): void {
  const contractProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for managing smart-contracts`);

  retrieveCommand(contractProgram, version);
  deployCommand(contractProgram, version);
}
