import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import {
  kadenaGenMnemonic as LegacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';
import { existsSync } from 'fs';

import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

import { clearCLI } from '../../utils/helpers.js'; // clearCLI
import * as storageService from '../utils/storage.js';

import chalk from 'chalk';

import { WALLET_DIR } from '../../constants/config.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  displayGeneratedWallet,
  displayStoredWallet,
} from '../utils/keysDisplay.js';
import type { IWalletConfig } from '../utils/keysHelpers.js';
async function generateKey(
  config: IWalletConfig,
): Promise<{ words: string; seed: string }> {
  let words: string;
  let seed: string;

  if (config.legacy === true) {
    words = LegacyKadenaGenMnemonic();
    seed = await legacykadenaMnemonicToRootKeypair(config.keyPassword, words);
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(config.keyPassword, words);
  }

  return { words, seed };
}

export const createGenerateWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create-wallet',
  'create your local wallet',
  [
    globalOptions.keyWallet(),
    globalOptions.keyPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-seed:action')({ config });

      // Check if wallet already exists
      const walletPath = `${WALLET_DIR}/${config.keyWallet}`;
      if (existsSync(walletPath)) {
        console.log(
          chalk.yellow(
            `\nWallet named "${config.keyWallet}" already exists.\n`,
          ),
        );
        return;
      }

      const { words, seed } = await generateKey(config);

      storageService.storeWallet(seed, config.keyWallet, config.legacy);
      displayGeneratedWallet(words, config);
      displayStoredWallet(config.keyWallet, config.legacy);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
