import { createSimpleSubCommand } from '../utils/helpers.js';

import { createNetworksCommand } from './createNetworksCommand.js';
import type { IListNetworksArgs } from './listNetworksCommand.js';
import { listNetworksAction } from './listNetworksCommand.js';
import { manageNetworks } from './manageNetworksCommand.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'networks' = 'networks';

export function networksCommandFactory(
  program: Command,
  version: string,
): void {
  const networksProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool to create and manage networks`);

  // Attach list subcommands to the networksProgram
  // createSimpleSubCommand<IListNetworksArgs>(
  //   'list',
  //   'List all available networks',
  //   listNetworksAction,
  // )(networksProgram);

  manageNetworks(networksProgram, version);
  createNetworksCommand(networksProgram, version);
}
