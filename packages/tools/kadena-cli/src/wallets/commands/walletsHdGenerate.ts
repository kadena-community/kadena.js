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
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';

export const generateHdKeys = async ({
  keyWallet,
  keyIndexOrRange,
  keyGenFromChoice,
  password,
  keyAlias,
}: {
  keyWallet: string;
  keyIndexOrRange: number | [number, number];
  keyGenFromChoice: 'genPublicSecretKey' | 'genPublicSecretKeyDec' | string;
  password: string;
  keyAlias: string;
}): Promise<
  CommandResult<{ keys: IKeyPair[]; legacy: boolean; startIndex: number }>
> => {
  try {
    const wallet = await getWallet(keyWallet);

    if (!wallet) {
      return {
        success: false,
        errors: [`The wallet "${keyWallet}" does not exist.`],
      };
    }

    const shouldGenerateSecretKeys =
      keyGenFromChoice === 'genPublicSecretKey' ||
      keyGenFromChoice === 'genPublicSecretKeyDec';

    const startIndex = extractStartIndex(keyIndexOrRange);

    const config = {
      keyWallet: await getWalletContent(keyWallet),
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
) => void = createCommandFlexible(
  'gen-hd',
  'Generate public/secret key pair(s) from your wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.securityPassword(),
    globalOptions.keyIndexOrRange({ isOptional: true }),
  ],
  async (option) => {
    const { keyWalletConfig, keyWallet } = await option.keyWallet();
    if (!keyWalletConfig) {
      throw new Error(`Wallet: ${keyWallet} does not exist.`);
    }

    const { keyIndexOrRange } = await option.keyIndexOrRange();
    const { keyGenFromChoice } = await option.keyGenFromChoice();
    const keyAlias =
      keyGenFromChoice !== 'genPublicSecretKeyDec'
        ? (await option.keyAlias()).keyAlias
        : '';
    const { securityPassword } = await option.securityPassword();

    const loadingSpinner = ora('Generating keys..').start();

    const result = await generateHdKeys({
      keyWallet: keyWalletConfig.wallet,
      keyIndexOrRange,
      keyGenFromChoice,
      password: securityPassword,
      keyAlias,
    });

    assertCommandError(result, loadingSpinner);

    displayGeneratedHdKeys(result.data.keys);
    if (keyGenFromChoice !== 'genPublicSecretKeyDec') {
      printStoredHdKeys(
        keyAlias,
        result.data.keys,
        result.data.legacy,
        result.data.startIndex,
      );
    }
  },
);
