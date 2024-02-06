import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
  randomBytes,
} from '@kadena/hd-wallet';

import { IHDBIP44, hdWalletRepository } from './hd-wallet.repository';

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

export function createBIP44Service() {
  let context: {
    encryptionKey: Uint8Array;
    encryptedSeed: Uint8Array;
  } | null = null;

  return {
    isReady: () => Boolean(context),
    reset: () => {
      context = null;
    },
    register: async (
      profileId: string,
      mnemonic: string,
      password: string,
      derivationPathTemplate: string = DEFAULT_DERIVATION_PATH_TEMPLATE,
    ): Promise<IHDBIP44> => {
      const encryptedMnemonic = await kadenaEncrypt(
        password,
        mnemonic,
        'buffer',
      );
      const secretId = crypto.randomUUID();
      await hdWalletRepository.addEncryptedValue(secretId, encryptedMnemonic);
      const keySource: IHDBIP44 = {
        uuid: crypto.randomUUID(),
        profileId,
        source: 'HD-BIP44',
        derivationPathTemplate,
        keys: [],
        secretId: secretId,
      };
      await hdWalletRepository.addKeySource(keySource);
      context = await createContext(mnemonic);
      return keySource;
    },

    connect: async (password: string, keySource: IHDBIP44) => {
      const encryptedMnemonic = await hdWalletRepository.getEncryptedValue(
        keySource.secretId,
      );
      const decryptedMnemonicBuffer = await kadenaDecrypt(
        password,
        encryptedMnemonic,
      );
      const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
      context = await createContext(mnemonic);
    },

    createKey: async (keySourceId: string, quantity: number = 1) => {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const keySource = await hdWalletRepository.getKeySource(keySourceId);
      if (!keySource || keySource.source !== 'HD-BIP44') {
        throw new Error('Invalid key source');
      }
      const startIndex = keySource.keys.length;
      const publicKeys = await kadenaGetPublic(
        context.encryptionKey,
        context.encryptedSeed,
        [startIndex, startIndex + quantity - 1],
        keySource.derivationPathTemplate,
      );
      const newKeys = publicKeys.map((publicKey, index) => ({
        publicKey,
        index: startIndex + index,
      }));
      keySource.keys.push(...newKeys);
      await hdWalletRepository.updateKeySource(keySource);
      return newKeys;
    },

    async sign(keySourceId: string, message: string, indexes: number[]) {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const keySource = await hdWalletRepository.getKeySource(keySourceId);
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
    },
  };
}

export type BIP44Service = ReturnType<typeof createBIP44Service>;
