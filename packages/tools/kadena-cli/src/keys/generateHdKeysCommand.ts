import { HDKEY_ENC_EXT, HDKEY_EXT } from '../constants/config.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import * as cryptoService from './utils/service.pure.js';
import { StorageService } from './utils/storage.js';
import type { THdKeygenOptions } from './hdKeysGenerateOptions.js';
import { HdKeygenOptions, hdKeygenQuestions } from './hdKeysGenerateOptions.js';

import chalk from 'chalk';
import type { Command } from 'commander';

export function generateHdKeys(program: Command, version: string): void {
  program
    .command('hd')
    .description('generate an HD-key or public-private key-pair')
    .option(
      '-f, --fileName <fileName>',
      'Enter a file name to store the key phrase in',
    )
    .option(
      '-p, --password <password>',
      'Enter a password to encrypt the key phrase with',
    )
    .action(async (args: THdKeygenOptions) => {
      try {
        const responses = await collectResponses(args, hdKeygenQuestions);

        const result = { ...args, ...responses };

        HdKeygenOptions.parse(result);

        // Use the CryptoService class
        // const cryptoService = new CryptoService();
        // Use the StorageService class
        const storageService = new StorageService();

        const hasPassword =
          result.password !== undefined && result.password.trim() !== '';

        const { words, seed } = await cryptoService.generateSeed(
          result.password,
        );
        storageService.storeHdKey(words, seed, result.fileName, hasPassword);

        const test = await cryptoService.setSeedFromMnemonic(
          words,
          result.password,
        );

        const test2 = await cryptoService.setSeedFromMnemonic(
          words,
          result.password,
        );

        const testP1 = await cryptoService.processStoredSeed(
          seed,
          result.password,
        );
        const testP2 = await cryptoService.processStoredSeed(
          test.seed,
          result.password,
        );
        const testP3 = await cryptoService.processStoredSeed(
          test2.seed,
          result.password,
        );

        console.log('words:', words);
        console.log('seed1:', seed);
        console.log('seed2:', test.seed);
        console.log('seed3:', test2.seed);

        console.log('testP1:', testP1);
        console.log('testP2:', testP2);
        console.log('testP3:', testP3);

        console.log(
          'publickey: ',
          cryptoService.getPublicKeyAtIndex(testP1, 0),
        );
        console.log(
          'publickey: ',
          cryptoService.getPublicKeyAtIndex(testP2, 0),
        );
        console.log(
          'publickey: ',
          cryptoService.getPublicKeyAtIndex(testP3, 0),
        );

        // todo time to write some real tests.

        clearCLI(true);
        console.log(chalk.green(`Generated HD Key: ${words}`));
        console.log(
          chalk.red(
            `The HD Key is stored within your keys folder under the filename: ${
              result.fileName
            }${hasPassword ? HDKEY_ENC_EXT : HDKEY_EXT} !`,
          ),
        );
      } catch (e) {
        console.log(e);
        processZodErrors(program, e, args);
      }
    });
}
