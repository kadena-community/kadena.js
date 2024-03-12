import { createNetworksCommand } from './commands/networkCreate.js';
import { deleteNetworksCommand } from './commands/networkDelete.js';
import { listNetworksCommand } from './commands/networkList.js';
import { manageNetworksCommand } from './commands/networkManage.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'network' = 'network';

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
