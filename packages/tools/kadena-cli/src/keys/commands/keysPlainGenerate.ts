import type { Command } from 'commander';
import { randomBytes } from 'crypto';

import { kadenaEncrypt, kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { keysOptions } from '../keysOptions.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import * as storageService from '../utils/storage.js';

const defaultAmount: number = 1;

async function generateKeyPairs(
  amount: number,
  legacy: boolean,
): Promise<storageService.IKeyPair[]> {
  if (legacy === true) {
    return await generateLegacyKeyPairs(amount);
  } else {
    const randomKeyPairs = kadenaKeyPairsFromRandom(amount);
    return randomKeyPairs.map((keyPair) => {
      return {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey,
      } as storageService.IKeyPair;
    });
  }
}

async function generateLegacyKeyPairs(
  amount: number,
): Promise<storageService.IKeyPair[]> {
  const keyPairs: storageService.IKeyPair[] = [];
  const password = '';
  const rootKey = await kadenaEncrypt(password, randomBytes(128));

  for (let i = 0; i < amount; i++) {
    const { publicKey, secretKey } = await kadenaGenKeypair(
      password,
      rootKey,
      i,
    );

    keyPairs.push({
      publicKey: publicKey,
      secretKey: secretKey,
    });
  }

  return keyPairs;
}
export const generatePlainKeys = async (
  alias: string,
  amount: number,
  legacy: boolean,
): Promise<CommandResult<{ keys: storageService.IKeyPair[] }>> => {
  const keys = await generateKeyPairs(amount, legacy);

  await storageService.savePlainKeyByAlias(alias, keys, legacy);

  return { success: true, data: { keys } };
};

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'generate',
  'Generate random public/secret key pair(s)',
  [
    globalOptions.keyAlias({ isOptional: false }),
    keysOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('generate-plain:action', config);

    const amount =
      config.keyAmount !== undefined && config.keyAmount !== null
        ? config.keyAmount
        : defaultAmount;

    const result = await generatePlainKeys(
      config.keyAlias,
      amount,
      config.legacy,
    );

    assertCommandError(result);

    displayGeneratedPlainKeys(result.data.keys);
    printStoredPlainKeys(config.keyAlias, result.data.keys, config.legacy);
  },
);
