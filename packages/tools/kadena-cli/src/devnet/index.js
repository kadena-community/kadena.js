import { startCommand } from './start.js';
const SUBCOMMAND_ROOT = 'devnet';
export function devnetCommandFactory(program, version) {
    const devnetProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for starting, stopping and managing the local devnet`);
    startCommand(devnetProgram, version);
}
