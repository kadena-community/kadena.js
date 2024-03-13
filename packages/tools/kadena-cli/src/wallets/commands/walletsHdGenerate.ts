import type { Command } from 'commander';
import ora from 'ora';

import {
  displayGeneratedHdKeys,
  printStoredHdKeys,
} from '../../keys/utils/keysDisplay.js';
import {
  extractStartIndex,
  getWallet,
  getWalletContent,
} from '../../keys/utils/keysHelpers.js';
import type { IKeyPair } from '../../keys/utils/storage.js';
import { saveKeyByAlias } from '../../keys/utils/storage.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';

export const generateHdKeys = async ({
  walletName,
  keyIndexOrRange,
  keyGenFromChoice,
  password,
  keyAlias,
}: {
  walletName: string;
  keyIndexOrRange: number | [number, number];
  keyGenFromChoice: 'genPublicSecretKey' | 'genPublicSecretKeyDec' | string;
  password: string;
  keyAlias: string;
}): Promise<
  CommandResult<{ keys: IKeyPair[]; legacy: boolean; startIndex: number }>
> => {
  try {
    const wallet = await getWallet(walletName);

    if (!wallet) {
      return {
        success: false,
        errors: [`The wallet "${walletName}" does not exist.`],
      };
    }

    const shouldGenerateSecretKeys =
      keyGenFromChoice === 'genPublicSecretKey' ||
      keyGenFromChoice === 'genPublicSecretKeyDec';

    const startIndex = extractStartIndex(keyIndexOrRange);

    const config = {
      walletName: await getWalletContent(walletName),
      securityPassword: password,
      keyGenFromChoice,
      keyIndexOrRange,
      legacy: wallet.legacy,
    } as IKeysConfig;

    const keys = await generateFromWallet(config, shouldGenerateSecretKeys);

    if (keyGenFromChoice !== 'genPublicSecretKeyDec') {
      await saveKeyByAlias(
        keyAlias,
        keys,
        wallet.legacy,
        wallet.wallet,
        startIndex,
      );
    }

    return { success: true, data: { keys, legacy: wallet.legacy, startIndex } };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
};

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'generate-keys',
  'Generate public/secret key pair(s) from your wallet',
  [
    globalOptions.walletSelect(),
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.passwordFile(),
    globalOptions.keyIndexOrRange({ isOptional: true }),
  ],
  async (option) => {
    const { walletNameConfig, walletName } = await option.walletName();
    if (!walletNameConfig) {
      throw new Error(`Wallet: ${walletName} does not exist.`);
    }

    const { keyIndexOrRange } = await option.keyIndexOrRange();
    const { keyGenFromChoice } = await option.keyGenFromChoice();
    const keyAlias =
      keyGenFromChoice !== 'genPublicSecretKeyDec'
        ? (await option.keyAlias()).keyAlias
        : '';
    const { passwordFile } = await option.passwordFile();

    const loadingSpinner = ora('Generating keys..').start();

    const result = await generateHdKeys({
      walletName: walletNameConfig.wallet,
      keyIndexOrRange,
      keyGenFromChoice,
      password: passwordFile,
      keyAlias,
    });

    assertCommandError(result, loadingSpinner);

    displayGeneratedHdKeys(result.data.keys);
    if (keyGenFromChoice !== 'genPublicSecretKeyDec') {
      printStoredHdKeys(
        walletNameConfig,
        keyAlias,
        result.data.keys,
        result.data.legacy,
        result.data.startIndex,
      );
    }
  },
);
