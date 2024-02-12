import { kadenaDecrypt, kadenaEncrypt, randomBytes } from '@kadena/hd-wallet';

import {
  kadenaGenKeypair,
  kadenaMnemonicToRootKeypair,
  kadenaSign,
} from '@kadena/hd-wallet/chainweaver';

import { IKeySource } from '@/modules/wallet/wallet.repository';
import { IHDChainweaver, keySourceRepository } from '../key-source.repository';

const createContext = async (password: string) => {
  const encryptionKey = randomBytes(32);
  const encryptedPassword = await kadenaEncrypt(
    encryptionKey,
    password,
    'buffer',
  );
  return { encryptionKey, encryptedPassword, cache: new Map() };
};

const decryptPassword = async (context: {
  encryptionKey: Uint8Array;
  encryptedPassword: Uint8Array;
}) => kadenaDecrypt(context.encryptionKey, context.encryptedPassword);

export function createChainweaverService() {
  let context: {
    encryptionKey: Uint8Array;
    encryptedPassword: Uint8Array;
    cache: Map<string, string>;
  } | null = null;

  return {
    isReady: () => Boolean(context),
    disconnect: () => {
      context = null;
    },
    clearCache: () => {
      if (context) {
        context.cache = new Map();
      }
    },
    register: async (
      profileId: string,
      mnemonic: string,
      password: string,
    ): Promise<IHDChainweaver> => {
      const encryptedMnemonic = await kadenaEncrypt(
        password,
        mnemonic,
        'buffer',
      );
      const secretId = crypto.randomUUID();
      const rootKeyId = crypto.randomUUID();
      const encryptedRootKey = await kadenaMnemonicToRootKeypair(
        password,
        mnemonic,
        'buffer',
      );
      await keySourceRepository.addEncryptedValue(secretId, encryptedMnemonic);
      await keySourceRepository.addEncryptedValue(rootKeyId, encryptedRootKey);
      const keySource: IHDChainweaver = {
        uuid: crypto.randomUUID(),
        profileId,
        source: 'HD-chainweaver',
        keys: [],
        secretId: secretId,
        rootKeyId,
      };
      await keySourceRepository.addKeySource(keySource);
      context = await createContext(password);
      return keySource;
    },

    connect: async (password: string, keySource: IHDChainweaver) => {
      const encryptedRootKey = await keySourceRepository.getEncryptedValue(
        keySource.rootKeyId,
      );
      await kadenaDecrypt(password, encryptedRootKey);
      context = await createContext(password);
    },

    getPublicKey: async (
      keySource: IKeySource | IHDChainweaver,
      startIndex: number,
      quantity: number = 1,
    ) => {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      if (
        keySource.source !== 'HD-chainweaver' ||
        !('rootKeyId' in keySource)
      ) {
        throw new Error('Invalid key source');
      }
      const password = await decryptPassword(context);
      const rootKey = await keySourceRepository.getEncryptedValue(
        keySource.rootKeyId,
      );
      const keys = await kadenaGenKeypair(password, rootKey, [
        startIndex,
        startIndex + quantity - 1,
      ]);
      const newKeys = await Promise.all(
        keys.map(async ({ publicKey, secretKey }, index) => {
          const secretId = crypto.randomUUID();
          if (context) {
            // since the process is slow we cache the secret key;
            // this should be removed when the wallet is locked
            context.cache.set(secretId, secretKey);
          }
          return {
            publicKey: publicKey,
            index: startIndex + index,
            secretId,
          };
        }),
      );
      return newKeys;
    },

    createKey: async (keySourceId: string, quantity: number = 1) => {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const keySource = await keySourceRepository.getKeySource(keySourceId);
      if (!keySource || keySource.source !== 'HD-chainweaver') {
        throw new Error('Invalid key source');
      }
      const startIndex = keySource.keys.length;
      const password = await decryptPassword(context);
      const rootKey = await keySourceRepository.getEncryptedValue(
        keySource.rootKeyId,
      );
      const keys = await kadenaGenKeypair(password, rootKey, [
        startIndex,
        startIndex + quantity - 1,
      ]);
      const newKeys = await Promise.all(
        keys.map(async ({ publicKey, secretKey }, index) => {
          const secretId = crypto.randomUUID();
          await keySourceRepository.addEncryptedValue(
            secretId,
            new TextEncoder().encode(secretKey),
          );
          return {
            publicKey: publicKey,
            index: startIndex + index,
            secretId,
          };
        }),
      );
      keySource.keys.push(...newKeys);
      await keySourceRepository.updateKeySource(keySource);
      return newKeys;
    },

    async sign(keySourceId: string, message: string, indexes: number[]) {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const keySource = await keySourceRepository.getKeySource(keySourceId);
      if (!keySource || keySource.source !== 'HD-chainweaver') {
        throw new Error('Invalid key source');
      }
      const password = await decryptPassword(context);
      const keys = await Promise.all(
        keySource.keys
          .filter((key) => indexes.includes(key.index))
          .map(async (key) => ({
            ...key,
            secretKey: await keySourceRepository.getEncryptedValue(
              key.secretId,
            ),
          })),
      );

      const result = await Promise.all(
        keys.map(async (key) => ({
          sig: new TextDecoder().decode(
            await kadenaSign(password, message, key.secretKey),
          ),
          pubKey: key.publicKey,
        })),
      );

      return result;
    },
  };
}

export type ChainweaverService = ReturnType<typeof createChainweaverService>;
