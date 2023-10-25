import { processZodErrors } from '../utils/processZodErrors.js';
export function storeCommand(program, version) {
    program
        .command('store')
        .description('store')
        .option('-p, --provider <storageProvider>')
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
