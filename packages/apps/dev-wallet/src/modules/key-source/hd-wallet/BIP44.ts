import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
  randomBytes,
} from '@kadena/hd-wallet';

import { IKeySource } from '@/modules/wallet/wallet.repository';
import { IHDBIP44, keySourceRepository } from '../key-source.repository';
import { getNextAvailableIndex } from './utils';

export const DEFAULT_DERIVATION_PATH_TEMPLATE = `m'/44'/626'/<index>'`;

const createContext = async (mnemonic: string) => {
  const encryptionKey = randomBytes(32);
  const encryptedSeed = await kadenaMnemonicToSeed(
    encryptionKey,
    mnemonic,
    'buffer',
  );
  return { encryptionKey, encryptedSeed };
};

export type BIP44Context = {
  encryptionKey: Uint8Array;
  encryptedSeed: Uint8Array;
};

export function createBIP44Service(initialContext: BIP44Context | null = null) {
  let context: BIP44Context | null = initialContext;

  const isConnected = () => Boolean(context);
  const disconnect = () => {
    context = null;
  };

  const register = async (
    profileId: string,
    mnemonic: string,
    password: string,
    derivationPathTemplate: string = DEFAULT_DERIVATION_PATH_TEMPLATE,
  ): Promise<IHDBIP44> => {
    const encryptedMnemonic = await kadenaEncrypt(password, mnemonic, 'buffer');
    const secretId = crypto.randomUUID();
    await keySourceRepository.addEncryptedValue(secretId, encryptedMnemonic);
    const keySource: IHDBIP44 = {
      uuid: crypto.randomUUID(),
      profileId,
      source: 'HD-BIP44',
      derivationPathTemplate,
      keys: [],
      secretId: secretId,
    };
    await keySourceRepository.addKeySource(keySource);
    context = await createContext(mnemonic);
    return keySource;
  };

  const connect = async (password: string, keySource: IHDBIP44) => {
    const encryptedMnemonic = await keySourceRepository.getEncryptedValue(
      keySource.secretId,
    );
    const decryptedMnemonicBuffer = await kadenaDecrypt(
      password,
      encryptedMnemonic,
    );
    const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
    context = await createContext(mnemonic);
  };

  const getPublicKey = async (
    keySource: IKeySource | IHDBIP44,
    startIndex: number,
  ) => {
    if (!context) {
      throw new Error('Wallet not unlocked');
    }
    if (
      keySource.source !== 'HD-BIP44' ||
      !('derivationPathTemplate' in keySource)
    ) {
      throw new Error('Invalid key source');
    }
    const publicKey = await kadenaGetPublic(
      context.encryptionKey,
      context.encryptedSeed,
      startIndex,
      keySource.derivationPathTemplate,
    );
    const newKey = {
      publicKey,
      index: startIndex,
    };
    return newKey;
  };

  const createKey = async (keySourceId: string, index?: number) => {
    if (!context) {
      throw new Error('Wallet not unlocked');
    }
    const keySource = await keySourceRepository.getKeySource(keySourceId);
    if (!keySource || keySource.source !== 'HD-BIP44') {
      throw new Error('Invalid key source');
    }
    const keyIndex =
      index ?? getNextAvailableIndex(keySource.keys.map((k) => k.index));

    const found = keySource.keys.find(
      (key) => key.index === keyIndex && key.publicKey,
    );
    if (found) {
      return found;
    }

    const newKey = await getPublicKey(keySource, keyIndex);

    keySource.keys.push(newKey);
    await keySourceRepository.updateKeySource(keySource);
    return newKey;
  };

  const sign = async (
    keySourceId: string,
    message: string,
    indexes: number[],
  ) => {
    if (!context) {
      throw new Error('Wallet not unlocked');
    }
    const keySource = await keySourceRepository.getKeySource(keySourceId);
    if (!keySource || keySource.source !== 'HD-BIP44') {
      throw new Error('Invalid key source');
    }
    const { encryptionKey, encryptedSeed } = context;
    return kadenaSignWithSeed(
      encryptionKey,
      encryptedSeed,
      indexes,
      keySource.derivationPathTemplate,
    )(message);
  };

  return {
    isConnected,
    disconnect,
    register,
    connect,
    createKey,
    getPublicKey,
    sign,
    clearCache: () => {},
    getContext: () => context,
  };
}

export type BIP44Service = ReturnType<typeof createBIP44Service>;
