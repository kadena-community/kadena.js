import type { EncryptedString } from '@kadena/hd-wallet';
import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGenKeypairFromSeed,
} from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import { toHexStr } from './keysHelpers.js';
import type { IKeyPair } from './storage.js';

const defaultAmount: number = 1;

export interface IKeysConfig {
  keyGenFromChoice: string;
  keyAlias: string;
  keySeed?: EncryptedString;
  keyMnemonic?: string;
  keyPassword: string;
  keyAmount?: number;
  legacy?: boolean;
}

export async function generateFromSeed(
  config: IKeysConfig,
): Promise<IKeyPair[]> {
  if (
    !['genPublicKey', 'genPublicPrivateKey'].includes(config.keyGenFromChoice)
  ) {
    throw new Error('Invalid choice');
  }

  return handlePublicPrivateKeysFrom(
    config,
    config.keyGenFromChoice === 'genPublicPrivateKey',
  );
}

export async function handlePublicPrivateKeysFrom(
  config: IKeysConfig,
  showPrivateKey: boolean = false,
): Promise<IKeyPair[]> {
  if (!config.keySeed) {
    throw new Error('Seed is required for this option.');
  }

  const keys: IKeyPair[] = [];
  const amount =
    config.keyAmount !== undefined && config.keyAmount > 0
      ? config.keyAmount
      : defaultAmount;

  for (let index = 0; index < amount; index++) {
    let publicKey: string;
    let privateKey: EncryptedString | undefined;

    if (config.legacy === true) {
      const decryptedSeed = kadenaDecrypt(config.keyPassword, config.keySeed);
      const [publicKeyUint8, privateKeyUint8] = await kadenaGenKeypair(
        config.keyPassword,
        decryptedSeed,
        index,
      );
      publicKey = toHexStr(publicKeyUint8);
      privateKey = kadenaEncrypt(config.keyPassword, privateKeyUint8);
    } else {
      const [publicKeyString, privateKeyString] =
        await kadenaGenKeypairFromSeed(
          config.keyPassword,
          config.keySeed,
          index,
        );
      publicKey = publicKeyString;
      privateKey = privateKeyString;
    }

    keys.push({ publicKey, ...(showPrivateKey && { privateKey }) });
  }

  return keys;
}
