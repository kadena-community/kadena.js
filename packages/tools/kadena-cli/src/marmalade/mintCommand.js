import { processZodErrors } from '../utils/processZodErrors.js';
export function mintCommand(program, version) {
    program
        .command('mint')
        .description('mint a new NFT on Marmalade')
        .action((args) => {
        try {
            // TODO: use @inquirer/prompts to interactively get missing flags
            // TODO: create zod validator
            // Options.parse(args);
        }
        catch (e) {
            processZodErrors(program, e, args);
        }
        // TODO: implement
        throw new Error('Not Implemented Yet');
    });
}
