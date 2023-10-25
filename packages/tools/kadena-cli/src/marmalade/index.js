import { mintCommand } from './mintCommand.js';
import { storeCommand } from './storeCommand.js';
const SUBCOMMAND_ROOT = 'marmalade';
export function marmaladeCommandFactory(program, version) {
    const marmaladeProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool for minting and managing NFTs with Marmalade`);
    mintCommand(marmaladeProgram, version);
    storeCommand(marmaladeProgram, version);
}
