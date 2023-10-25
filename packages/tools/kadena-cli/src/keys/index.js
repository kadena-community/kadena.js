import { generateFromHdKeys } from './generateFromHdKeysCommand.js';
import { generateHdKeys } from './generateHdKeysCommand.js';
import { generatePlainKeys } from './generatePlainKeysCommand.js';
import { listKeys } from './listKeysCommand.js';
import { manageKeys } from './manageKeysCommand.js';
const SUBCOMMAND_ROOT = 'keys';
export function generate(program, version) {
    const generateProgram = program
        .command('generate')
        .description(`Generate keys`);
    generateHdKeys(generateProgram, version);
    generateFromHdKeys(generateProgram, version);
    generatePlainKeys(generateProgram, version);
}
export function keysCommandFactory(program, version) {
    const keysProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to generate and manage keys`);
    generate(keysProgram, version);
    listKeys(keysProgram, version);
    manageKeys(keysProgram, version);
}
