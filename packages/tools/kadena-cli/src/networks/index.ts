import { createSimpleSubCommand } from '../utils/helpers';

import { createNetworksCommand } from './createNetworksCommand';
import type { IListNetworksArgs } from './listNetworksCommand';
import { listNetworksAction } from './listNetworksCommand';
import { manageNetworks } from './manageNetworksCommand';

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
  createSimpleSubCommand<IListNetworksArgs>(
    'list',
    'List all available networks',
    listNetworksAction,
  )(networksProgram);

  manageNetworks(networksProgram, version);
  createNetworksCommand(networksProgram, version);
}
