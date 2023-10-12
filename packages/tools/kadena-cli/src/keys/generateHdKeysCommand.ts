import { HDKEY_EXT } from '../constants/config.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import { CryptoService } from './utils/service.js';
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
    .action(async (args: THdKeygenOptions) => {
      try {
        const responses = await collectResponses(args, hdKeygenQuestions);

        const result = { ...args, ...responses };

        HdKeygenOptions.parse(result);

        // Use the CryptoService class
        const cryptoService = new CryptoService();
        // Use the StorageService class
        const storageService = new StorageService();

        const hdKey = await cryptoService.generateSeed();
        storageService.storeHdKey(hdKey, result.fileName);
        clearCLI(true);
        console.log(chalk.green(`Generated HD Key: ${hdKey}${HDKEY_EXT}`));
        console.log(
          chalk.red(
            `The HD Key is stored within your keys folder under the filename: ${result.fileName} ! This phrase cannot be recovered if lost!`,
          ),
        );
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
