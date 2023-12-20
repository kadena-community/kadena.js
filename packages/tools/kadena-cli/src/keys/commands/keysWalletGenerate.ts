// External library imports
import chalk from 'chalk';
import debug from 'debug';

import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import {
  kadenaGenMnemonic as LegacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

// Internal module imports
import type { Command } from 'commander';
import { WALLET_DIR } from '../../constants/config.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { services } from '../../services/index.js';
import {
  displayGeneratedWallet,
  displayStoredWallet,
} from '../utils/keysDisplay.js';
import type { IWalletConfig } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

/**
 * Generates a new key for the wallet.
 * @param {IWalletConfig} config - The wallet configuration.
 * @returns {Promise<{words: string, seed: string}>} - The mnemonic words and seed.
 */
async function generateKey(
  config: IWalletConfig,
): Promise<{ words: string; seed: string }> {
  let words: string;
  let seed: string;

  if (config.legacy === true) {
    words = LegacyKadenaGenMnemonic();
    seed = await legacykadenaMnemonicToRootKeypair(
      config.securityPassword,
      words,
    );
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(config.securityPassword, words);
  }

  return { words, seed };
}

/**
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const createGenerateWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create-wallet',
  'create your local wallet',
  [
    globalOptions.keyWallet({ isOptional: false }),
    globalOptions.securityPassword({ isOptional: false }),
    globalOptions.securityVerifyPassword({ isOptional: false }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    try {
      debug('create-wallet:action')({ config });

      // compare passwords
      if (config.securityPassword !== config.securityVerifyPassword) {
        console.log(chalk.red(`\nPasswords don't match. Please try again.\n`));
        return process.exit(1);
      }

      // Check for existing wallet
      const walletPath = `${WALLET_DIR}/${config.keyWallet}`;
      if (await services.filesystem.fileExists(walletPath)) {
        console.log(
          chalk.yellow(
            `\nWallet named "${config.keyWallet}" already exists.\n`,
          ),
        );
        return process.exit(1);
      }

      const { words, seed } = await generateKey(config);

      await storageService.storeWallet(seed, config.keyWallet, config.legacy);
      displayGeneratedWallet(words, config);
      displayStoredWallet(config.keyWallet, config.legacy);
    } catch (error) {
      console.error(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
