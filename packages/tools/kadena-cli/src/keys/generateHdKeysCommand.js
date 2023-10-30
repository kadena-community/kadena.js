import { HDKEY_ENC_EXT, HDKEY_EXT } from '../constants/config.js';
import { collectResponses } from '../utils/helpers.js'; // clearCLI
import { processZodErrors } from '../utils/processZodErrors.js';
import {
// generateSeedPhrase,
getKeyPairsFromSeedPhrase, } from './legacy/chainweaver.js';
import * as cryptoService from './utils/service.js';
import * as storageService from './utils/storage.js';
import { HdKeygenOptions, hdKeygenQuestions } from './hdKeysGenerateOptions.js';
import chalk from 'chalk';
export function generateHdKeys(program, version) {
    program
        .command('hd')
        .description('generate an HD-key or public-private key-pair')
        .option('-f, --fileName <fileName>', 'Enter a file name to store the key phrase in')
        .option('-p, --password <password>', 'Enter a password to encrypt the key phrase with')
        .action(async (args) => {
        try {
            const responses = await collectResponses(args, hdKeygenQuestions);
            const result = { ...args, ...responses };
            HdKeygenOptions.parse(result);
            const hasPassword = result.password !== undefined && result.password.trim() !== '';
            const { words, seed } = await cryptoService.generateSeed(result.password);
            storageService.storeHdKey(words, seed, result.fileName, hasPassword);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const pairs = await getKeyPairsFromSeedPhrase('');
            console.log(pairs.publicKey);
            // console.log(generateSeedPhrase());
            // const testP1 = await cryptoService.processStoredSeed(
            //   seed,
            //   result.password,
            // );
            // clearCLI(true);
            console.log(chalk.green(`Generated HD Key: ${words}`));
            console.log(chalk.red(`The HD Key is stored within your keys folder under the filename: ${result.fileName}${hasPassword ? HDKEY_ENC_EXT : HDKEY_EXT} !`));
        }
        catch (e) {
            console.log(e);
            processZodErrors(program, e, args);
        }
    });
}
