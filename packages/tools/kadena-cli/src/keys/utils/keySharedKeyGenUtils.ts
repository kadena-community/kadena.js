import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import { fromHexStr, toHexStr } from './keysHelpers.js';
import type { IKeyPair } from './storage.js';

const defaultAmount: number = 1;

export interface IKeysConfig {
  keyGenFromChoice: string;
  keyAlias: string;
  keySeed?: string;
  keyMnemonic?: string;
  keyPassword: string;
  keyAmount?: number;
  legacy?: boolean;
}

export async function generateFromHd(config: IKeysConfig): Promise<IKeyPair[]> {
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
): Promise<Array<{ publicKey: string; privateKey?: string }>> {
  if (config.keySeed === undefined) {
    throw new Error('Seed is required for this option.');
  }

  const keys: Array<IKeyPair> = [];
  const amount =
    config.keyAmount !== undefined && config.keyAmount > 0
      ? config.keyAmount
      : defaultAmount;

  for (let index = 0; index < amount; index++) {
    let keyGenResult: [Uint8Array | string, Uint8Array | string];

    if (config.legacy === true) {
      keyGenResult = await kadenaGenKeypair(
        config.keyPassword,
        fromHexStr(config.keySeed),
        index,
      );
    } else {
      keyGenResult = await kadenaGenKeypairFromSeed(
        config.keyPassword,
        config.keySeed as EncryptedString,
        index,
      );
    }

    const publicKey =
      typeof keyGenResult[0] === 'string'
        ? keyGenResult[0]
        : toHexStr(keyGenResult[0]);
    const encryptedPrivateKey =
      typeof keyGenResult[1] === 'string'
        ? keyGenResult[1]
        : toHexStr(keyGenResult[1]);

    const keyPair: IKeyPair = {
      publicKey,
      ...(showPrivateKey && { privateKey: encryptedPrivateKey }),
    };

    keys.push(keyPair);
  }

  return keys;
}
