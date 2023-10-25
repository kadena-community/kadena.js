import { createSimpleSubCommand } from '../utils/helpers.js';
import { createNetworksCommand } from './createNetworksCommand.js';
import { listNetworksAction } from './listNetworksCommand.js';
import { manageNetworks } from './manageNetworksCommand.js';
const SUBCOMMAND_ROOT = 'networks';
export function networksCommandFactory(program, version) {
    const networksProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to create and manage networks`);
    // Attach list subcommands to the networksProgram
    createSimpleSubCommand('list', 'List all available networks', listNetworksAction)(networksProgram);
    manageNetworks(networksProgram, version);
    createNetworksCommand(networksProgram, version);
}
