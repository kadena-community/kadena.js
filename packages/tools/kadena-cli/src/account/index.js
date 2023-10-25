import { fundCommand } from './fundCommand.js';
const SUBCOMMAND_ROOT = 'account';
export function accountCommandFactory(program, version) {
    const accountProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to manage accounts of fungibles (e.g. 'coin')`);
    fundCommand(accountProgram, version);
}
