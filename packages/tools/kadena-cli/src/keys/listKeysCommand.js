import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { ListKeysOptions, listKeysQuestions } from './listKeysOptions.js';
// TO-DO: Implement this command
// choices: [
//   'List all keys',
//      > HD keys encrypted with password
//         > select and show key
//      > HD keys unencrypted
//         > select and show key
//      > Plain keys
//         > select and show key
//   'Exit'
// ],
export function listKeys(program, version) {
    program
        .command('list-keys')
        .description('generate an HD-key or public-private key-pair')
        .option('-k, --keyFile <keyFile>', 'Select a key file to list keys from (HD or plain)')
        .option('-a, --aliasedKeyFile <aliasedKeyFile>', 'Select a aliased key file to list keys from')
        .option('-i, --index <index>', 'Select a key index to list keys from')
        // .option('-c, --chainweaver <chainweaver>', 'Use chainweaver to list keys')
        .action(async (args) => {
        try {
            const responses = await collectResponses(args, listKeysQuestions);
            const result = { ...args, ...responses };
            clearCLI();
            ListKeysOptions.parse(result);
        }
        catch (e) {
            processZodErrors(program, e, args);
        }
    });
}
