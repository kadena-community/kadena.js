import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import chalk from 'chalk';
import type { Command } from 'commander';
import { randomBytes } from 'crypto';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { clearCLI } from '../../utils/helpers.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import { toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

interface IGeneratePlainKeysCommandConfig {
  keyAlias: string;
  keyAmount?: number;
  legacy?: boolean;
}

const defaultAmount: number = 1;

async function generateKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<storageService.IKeyPair[]> {
  if (config.legacy === true) {
    return generateLegacyKeyPairs(config, amount);
  } else {
    const randomKeyPairs = await kadenaKeyPairsFromRandom(amount);
    return randomKeyPairs.map((keyPair) => {
      return {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.secretKey,
      } as storageService.IKeyPair;
    });
  }
}

async function generateLegacyKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<storageService.IKeyPair[]> {
  const keyPairs: storageService.IKeyPair[] = [];
  const password = '';
  const rootKey = randomBytes(128);

  for (let i = 0; i < amount; i++) {
    const [publicKey, privateKey] = await kadenaGenKeypair(
      password,
      rootKey,
      i,
    );

    keyPairs.push({
      publicKey: toHexStr(publicKey),
      privateKey: toHexStr(privateKey),
    });
  }

  return keyPairs;
}

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'gen-plain',
  'generate plain public/private key pair(s)',
  [
    globalOptions.keyAlias(),
    globalOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-plain-key:action')({ config });
      const amount =
        config.keyAmount !== undefined && config.keyAmount !== ''
          ? config.keyAmount
          : defaultAmount;
      const keys = await generateKeyPairs(config, amount);

      displayGeneratedPlainKeys(keys);

      await storageService.savePlainKeyByAlias(
        config.keyAlias,
        keys,
        config.legacy,
      );
      printStoredPlainKeys(config.keyAlias, keys, config.legacy);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
