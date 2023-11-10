import { createNetworksCommand } from './createNetworksCommand.js';
import { deleteNetworksCommand } from './deleteNetworksCommand.js';
import { listNetworksCommand } from './listNetworksCommand.js';
import { manageNetworksCommand } from './manageNetworksCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'networks' = 'networks';

export function networksCommandFactory(
  program: Command,
  version: string,
): void {
  const networksProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to create and manage networks`);

  listNetworksCommand(networksProgram, version);
  manageNetworksCommand(networksProgram, version);
  createNetworksCommand(networksProgram, version);
  deleteNetworksCommand(networksProgram, version);
}
