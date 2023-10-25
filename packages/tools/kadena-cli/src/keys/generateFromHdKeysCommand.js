import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { HdKeygenOptions, hdKeygenQuestions } from './hdKeysGenerateOptions.js';
// TO-DO: Implement this command
// choices: [
//    > Generate Public key from HD key
//    > Generate Public and Private key from HD key
//    > Generate Public and Private key from newly generated HD key
//   'Exit'
// ],
export function generateFromHdKeys(program, version) {
    program
        .command('gen-from-hd')
        .description('generate keys from an HD-key')
        .option('-f, --fileName <fileName>', 'Enter hd key file name to generate keys from')
        .action(async (args) => {
        try {
            const responses = await collectResponses(args, hdKeygenQuestions);
            const result = { ...args, ...responses };
            HdKeygenOptions.parse(result);
            clearCLI();
        }
        catch (e) {
            console.log(e);
            processZodErrors(program, e, args);
        }
    });
}
