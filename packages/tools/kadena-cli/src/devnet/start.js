import { processZodErrors } from '../utils/processZodErrors.js';
export function startCommand(program, version) {
    program
        .command('start')
        .description('start the local devnet')
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
