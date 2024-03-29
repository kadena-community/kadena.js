import { createNetworksCommand } from './commands/networkCreate.js';
import { createNetworkSetDefaultCommand } from './commands/networkDefault.js';
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

  createNetworksCommand(networksProgram, version);
  createNetworkSetDefaultCommand(networksProgram, version);
  manageNetworksCommand(networksProgram, version);
  deleteNetworksCommand(networksProgram, version);
  listNetworksCommand(networksProgram, version);
}
