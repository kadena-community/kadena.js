import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import type { Command } from 'commander';
import { randomBytes } from 'crypto';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import { toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

interface IGeneratePlainKeysCommandConfig {
  keyAlias?: string;
  keyAmount?: number;
  legacy?: boolean;
}

const defaultAmount: number = 1;

async function generateKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<storageService.IKeyPair[]> {
  if (config.legacy === true) {
    return generateLegacyKeyPairs(amount);
  } else {
    const randomKeyPairs = await kadenaKeyPairsFromRandom(amount);
    return randomKeyPairs.map(
      (keyPair) =>
        ({
          publicKey: keyPair.publicKey,
          privateKey: keyPair.secretKey,
        }) as storageService.IKeyPair,
    );
  }
}

async function generateLegacyKeyPairs(
  amount: number,
): Promise<storageService.IKeyPair[]> {
  const keyPairs: storageService.IKeyPair[] = [];
  const password = '';
  const rootKey = randomBytes(128);

  for (let i = 0; i < amount; i++) {
    const [encryptedSecret, publicKey] = await kadenaGenKeypair(
      password,
      rootKey,
      i,
    );
    keyPairs.push({
      publicKey: toHexStr(encryptedSecret),
      privateKey: toHexStr(publicKey),
    });
  }

  return keyPairs;
}

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'plain',
  'generate (plain) public-private key-pair',
  [
    globalOptions.keyAlias(),
    globalOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
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
  },
);
