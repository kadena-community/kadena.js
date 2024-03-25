import type { Command } from 'commander';

import {
  extractStartIndex,
  getWallet,
  getWalletContent,
} from '../../keys/utils/keysHelpers.js';
import type { IKeyPair } from '../../keys/utils/storage.js';
import { saveKeyByAlias } from '../../keys/utils/storage.js';
import { services } from '../../services/index.js';
import type { IWalletKey } from '../../services/wallet/wallet.types.js';
import type { CommandResult } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';
import { walletOptions } from '../walletOptions.js';

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
  'generate-key',
  'Generate public/secret key pair(s) from your wallet',
  [
    globalOptions.walletSelect(),
    walletOptions.amount(),
    walletOptions.startIndex({ disableQuestion: true }),
    walletOptions.keyAlias(),
    securityOptions.createPasswordOption({
      message: 'Enter the wallet password',
    }),
    globalOptions.keyIndexOrRange({ isOptional: true }),
  ],
  async (option) => {
    const { walletNameConfig: wallet, walletName } = await option.walletName();
    if (!wallet) {
      throw new Error(`Wallet: ${walletName} does not exist.`);
    }

    const { amount } = await option.amount();
    const { startIndex } = await option.startIndex();
    const { keyAlias } = await option.keyAlias();

    const { passwordFile } = await option.passwordFile();

    // const loadingSpinner = ora('Generating keys..').start();

    const defaultStartIndex =
      Math.max(...wallet.keys.map((key) => key.index)) + 1;

    const keyAmount = Number(amount) || 1;
    const keys: IWalletKey[] = [];
    for (let i = 0; i < keyAmount; i++) {
      const key = await services.wallet.generateKey({
        index: (Number(startIndex) || defaultStartIndex) + i,
        legacy: wallet.legacy,
        password: passwordFile,
        seed: wallet.seed,
        alias: keyAlias,
      });
      await services.wallet.storeKey(wallet, key);
      keys.push(key);
    }

    log.output(
      log.generateTableString(
        ['Public key', 'Index'],
        keys.map((key) => [key.publicKey, key.index.toString()]),
      ),
    );
    log.info();
    log.info(
      log.generateTableString(
        ['Wallet Storage Location'],
        [[relativeToCwd(wallet.filepath)]],
      ),
    );
  },
);
