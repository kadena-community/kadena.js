import { sendCommand } from './send.js';
const SUBCOMMAND_ROOT = 'tx';
export function txCommandFactory(program, version) {
    const txProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for creating and managing transactions`);
    sendCommand(txProgram, version);
}
