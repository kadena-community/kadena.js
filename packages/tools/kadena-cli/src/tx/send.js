import { processZodErrors } from '../utils/processZodErrors.js';
export function sendCommand(program, version) {
    program
        .command('send')
        .description('send a transaction to the blockchain')
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
