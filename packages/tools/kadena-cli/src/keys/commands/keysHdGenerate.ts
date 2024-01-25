import type { Command } from 'commander';
import debug from 'debug';
import ora from 'ora';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';
import {
  displayGeneratedHdKeys,
  printStoredHdKeys,
} from '../utils/keysDisplay.js';
import {
  extractStartIndex,
  getWallet,
  getWalletContent,
} from '../utils/keysHelpers.js';
import type { IKeyPair } from '../utils/storage.js';
import { saveKeyByAlias } from '../utils/storage.js';

/*
kadena keys create-wallet --key-wallet "test01" --security-password 12345678 --security-verify-password 12345678
kadena keys gen-hd --key-wallet "test01.wallet" --key-gen-from-choice "genPublicSecretKey" --key-alias "test" --security-password 12345678 --key-index-or-range "1"
*/

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

  await saveKeyByAlias(
    keyAlias,
    keys,
    wallet.legacy,
    wallet.wallet,
    startIndex,
  );

  return { success: true, data: { keys, legacy: wallet.legacy, startIndex } };
};

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'gen-hd',
  'generate public/secret key pair(s) from your wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.securityPassword(),
    globalOptions.keyIndexOrRange({ isOptional: true }),
  ],
  async (config) => {
    debug('generate-hdkeys:action')({ config });

    if (typeof config.keyWallet === 'string') {
      throw Error('Invalid wallet name');
    }

    const loadingSpinner = ora('Generating keys..').start();

    const result = await generateHdKeys({
      keyWallet: config.keyWallet.fileName,
      keyIndexOrRange: config.keyIndexOrRange,
      keyGenFromChoice: config.keyGenFromChoice,
      password: config.securityPassword,
      keyAlias: config.keyAlias,
    });

    loadingSpinner.succeed('Completed');

    assertCommandError(result);

    displayGeneratedHdKeys(result.data.keys);
    printStoredHdKeys(
      config.keyAlias,
      result.data.keys,
      result.data.legacy,
      result.data.startIndex,
    );
  },
);
