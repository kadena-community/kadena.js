import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import { kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair } from '@kadena/hd-wallet/chainweaver';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGenUtils.js';
import { generateFromHd } from '../utils/keySharedKeyGenUtils.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import { toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

import ora from 'ora';

export const createGenerateFromMnemonic: (
  program: Command,
  version: string,
) => void = createCommand(
  'from-mnemonic',
  'Generate key(s) from Mnemonic phrase',
  [
    globalOptions.keyGenFromChoice(),
    globalOptions.keyMnemonic(),
    globalOptions.keyPassword(),
    globalOptions.keyAlias(),
    globalOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    debug('generate-from-mnemonic:action')({ config });

    const loading = ora('Generating..').start();
    try {
      let keySeed: EncryptedString | undefined;

      if (config.legacy === true) {
        const buffer = await legacykadenaMnemonicToRootKeypair(
          config.keyPassword,
          config.keyMnemonic,
        );
        keySeed = toHexStr(buffer) as EncryptedString;
      } else {
        keySeed = await kadenaMnemonicToSeed(
          config.keyPassword,
          config.keyMnemonic,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { keyMnemonic, keyGenFromChoice, ...rest } = config;
      const result = {
        ...rest,
        keySeed: keySeed as EncryptedString,
        keyGenFromChoice,
      };
      const keys = await generateFromHd(result as IKeysConfig);
      loading.succeed('Completed');
      displayGeneratedPlainKeys(keys);

      await storageService.savePlainKeyByAlias(config.keyAlias, keys, false);
      printStoredPlainKeys(config.keyAlias, keys, false);
    } catch (error) {
      loading.fail('Operation failed');
      console.error(`Error: ${error instanceof Error ? error.message : error}`);
    }
  },
);
