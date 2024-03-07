import type { Command } from 'commander';
import ora from 'ora';
import path from 'path';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import { kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair } from '@kadena/hd-wallet/chainweaver';

import { displayStoredWallet } from '../../keys/utils/keysDisplay.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWallet } from '../../keys/utils/keysHelpers.js';
import * as storageService from '../../keys/utils/storage.js';
import { addWalletExtension } from '../../keys/utils/storage.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { walletOptions } from '../walletOptions.js';

export const importWallet = async ({
  mnemonic,
  password,
  walletName,
  legacy,
}: {
  /** mnemonic word phrase, not validated here, expect prompt to validate */
  mnemonic: string;
  password: string;
  /** Just the wallet name (excluding file extension) */
  walletName: string;
  legacy?: boolean;
}): Promise<CommandResult<{ wallet: IWallet }>> => {
  const existing = await getWallet(addWalletExtension(walletName, legacy));

  if (existing !== null && existing.legacy === legacy) {
    return {
      success: false,
      errors: [`Wallet "${walletName}" already exists.`],
    };
  }

  let keySeed: EncryptedString;

  if (legacy === true) {
    keySeed = await legacykadenaMnemonicToRootKeypair(password, mnemonic);
  } else {
    keySeed = await kadenaMnemonicToSeed(password, mnemonic);
  }

  const walletPath = await storageService.storeWallet(
    keySeed,
    walletName,
    legacy,
  );

  const wallet = await getWallet(path.basename(walletPath));

  if (!wallet) {
    return { success: false, errors: [`Failed to create wallet`] };
  }

  return { success: true, data: { wallet } };
};

export const createImportWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'import',
  'Import (restore) wallet from mnemonic phrase',
  [
    walletOptions.keyMnemonic(),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Enter the password again',
    }),
    walletOptions.walletName(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('import-wallet:action', config);

    const loading = ora('Generating..').start();

    const result = await importWallet({
      walletName: config.walletName,
      mnemonic: config.keyMnemonic,
      password: config.passwordFile,
      legacy: config.legacy,
    });

    assertCommandError(result, loading);

    displayStoredWallet(config.walletName, result.data.wallet.legacy);
  },
);
