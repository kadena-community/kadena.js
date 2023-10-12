import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

// import { CryptoService } from './utils/service.js';
// import { StorageService } from './utils/storage.js';
import type { TListKeysOptions } from './listKeysOptions.js';
import { ListKeysOptions, listKeysQuestions } from './listKeysOptions.js';

// import chalk from 'chalk';
import type { Command } from 'commander';

export function listKeys(program: Command, version: string): void {
  program
    .command('list-keys')
    .description('generate an HD-key or public-private key-pair')
    .option(
      '-k, --keyFile <keyFile>',
      'Select a key file to list keys from (HD or plain)',
    )
    .option(
      '-a, --aliasedKeyFile <aliasedKeyFile>',
      'Select a aliased key file to list keys from',
    )
    .option('-i, --index <index>', 'Select a key index to list keys from')
    // .option('-c, --chainweaver <chainweaver>', 'Use chainweaver to list keys')
    .action(async (args: TListKeysOptions) => {
      try {
        const responses = await collectResponses(args, listKeysQuestions);

        const result = { ...args, ...responses };
        clearCLI();

        ListKeysOptions.parse(result);
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
