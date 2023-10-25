import { PLAINKEY_EXT } from '../constants/config.js';
import { clearCLI, collectResponses } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';

import * as cryptoService from './utils/service.js';
import * as storageService from './utils/storage.js';
import type { TPlainKeygenOptions } from './plainKeysGenerateOptions.js';
import {
  // PlainKeygenOptions,
  plainKeygenQuestions,
} from './plainKeysGenerateOptions.js';

import chalk from 'chalk';
import type { Command } from 'commander';

export function generatePlainKeys(program: Command, version: string): void {
  program
    .command('plain')
    .description('generate (plain) public-private key-pair')
    .option(
      '-al, --alias <alias>',
      'Enter an alias to store the key pair under (optional)',
    )
    .option(
      '-a, --amount <amount>',
      'Enter the amount of key pairs you want to generate. (aliases can only be used when generating one key pair) (optional) (default: 1)',
    )
    .action(async (args: TPlainKeygenOptions) => {
      try {
        const responses = await collectResponses(args, plainKeygenQuestions);

        const result = { ...args, ...responses };

        // PlainKeygenOptions.parse(result);

        const plainKeyPairs = cryptoService.generateKeyPairsFromRandom(
          result.amount,
        );
        clearCLI(true);
        console.log(
          chalk.green(
            `Generated Plain Key Pair(s): ${JSON.stringify(
              plainKeyPairs,
              null,
              2,
            )}`,
          ),
        );

        if (result.alias !== undefined) {
          storageService.savePlainKeyByAlias(
            result.alias,
            plainKeyPairs[0].publicKey,
            plainKeyPairs[0].secretKey,
            result.amount,
          );

          console.log(
            chalk.green(
              'The Plain Key Pair is stored within your keys folder under the filename(s):',
            ),
          );

          const totalKeys = result.amount === undefined ? 1 : result.amount;
          for (let i = 0; i < totalKeys; i++) {
            const keyName =
              i === 0
                ? `${result.alias}${PLAINKEY_EXT}`
                : `${result.alias}-${i}${PLAINKEY_EXT}`;
            console.log(chalk.green(`- ${keyName}`));
          }
        }
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
