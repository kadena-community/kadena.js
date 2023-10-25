import { deployCommand } from './deployCommand.js';
import { retrieveCommand } from './retrieveCommand.js';
const SUBCOMMAND_ROOT = 'contract';
/**
 * Create subcommand `kadena contract`
 * `kadena contract retrieve`
 * `kadena contract deploy`
 */
export function contractCommandFactory(program, version) {
    const contractProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for managing smart-contracts`);
    retrieveCommand(contractProgram, version);
    deployCommand(contractProgram, version);
}
