import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import chalk from 'chalk';
import debug from 'debug';

import { PLAINKEY_EXT } from '../../constants/config.js';
import { clearCLI } from '../../utils/helpers.js';

import * as cryptoService from '../utils/service.js';
import * as storageService from '../utils/storage.js';

import type { Command } from 'commander';

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'plain',
  'generate (plain) public-private key-pair',
  [globalOptions.keyAlias(), globalOptions.keyAmount()],
  async (config) => {
    debug('generate-plain-key:action')({ config });
    const amount = (config.keyAmount as unknown as number) || 1;

    const plainKeyPairs = cryptoService.generateKeyPairsFromRandom(amount);
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

    if (config.keyAlias !== undefined) {
      storageService.savePlainKeyByAlias(
        config.keyAlias,
        plainKeyPairs[0].publicKey,
        plainKeyPairs[0].secretKey,
        amount,
      );

      console.log(
        chalk.green(
          'The Plain Key Pair is stored within your keys folder under the filename(s):',
        ),
      );

      const totalKeys = amount === undefined ? 1 : amount;
      for (let i = 0; i < totalKeys; i++) {
        const keyName =
          i === 0
            ? `${config.keyAlias}${PLAINKEY_EXT}`
            : `${config.keyAlias}-${i}${PLAINKEY_EXT}`;
        console.log(chalk.green(`- ${keyName}`));
      }
    }
  },
);
