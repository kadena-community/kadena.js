import type { Command } from 'commander';
import { join } from 'path';

import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import {
  kadenaGenMnemonic as LegacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

import { WALLET_DIR } from '../../constants/config.js';
import {
  displayGeneratedWallet,
  displayStoredWallet,
} from '../../keys/utils/keysDisplay.js';
import { getWallet } from '../../keys/utils/keysHelpers.js';
import * as storageService from '../../keys/utils/storage.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { walletOptions } from '../walletOptions.js';

/**
 * Generates a new key for the wallet.
 * @param {string} password - The password to encrypt the mnemonic with.
 * @param {boolean} legacy - Whether to use legacy format.
 * @returns {Promise<{words: string, seed: string}>} - The mnemonic words and seed.
 */
async function generateKey(
  password: string,
  legacy: boolean,
): Promise<{ words: string; seed: string }> {
  let words: string;
  let seed: string;

  if (legacy === true) {
    words = LegacyKadenaGenMnemonic();
    seed = await legacykadenaMnemonicToRootKeypair(password, words);
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(password, words);
  }

  return { words, seed };
}

export const generateWallet = async (
  walletName: string,
  password: string,
  legacy = false,
): Promise<
  CommandResult<{
    mnemonic: string;
    path: string;
  }>
> => {
  const existing = await getWallet(
    storageService.addWalletExtension(walletName, legacy),
  );

  if (existing !== null && existing.legacy === legacy) {
    return {
      success: false,
      errors: [`Wallet "${walletName}" already exists.`],
    };
  }

  const walletPath = join(WALLET_DIR, walletName);
  if (await services.filesystem.fileExists(walletPath)) {
    return {
      success: false,
      errors: [`Wallet named "${walletName}" already exists.`],
    };
  }

  const { words, seed } = await generateKey(password, legacy);

  const path = await storageService.storeWallet(seed, walletName, legacy);

  return {
    success: true,
    data: { mnemonic: words, path },
  };
};

/**
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const createGenerateWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add',
  'Add a new wallet',
  [
    walletOptions.walletName({ isOptional: false }),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Re-enter the password',
    }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('create-wallet:action', config);

    const result = await generateWallet(
      config.walletName,
      config.passwordFile,
      config.legacy,
    );

    assertCommandError(result);

    displayGeneratedWallet(result.data.mnemonic);
    displayStoredWallet(config.walletName, config.legacy);
  },
);
