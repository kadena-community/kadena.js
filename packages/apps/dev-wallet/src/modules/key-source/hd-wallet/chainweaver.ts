import { kadenaDecrypt, kadenaEncrypt, randomBytes } from '@kadena/hd-wallet';

import {
  kadenaChangePassword,
  kadenaGenKeypair,
  kadenaMnemonicToRootKeypair,
  kadenaSign,
  legacyKadenaGenKeypair,
} from '@kadena/hd-wallet/chainweaver';

import { IKeySource } from '@/modules/wallet/wallet.repository';
import { IHDChainweaver, keySourceRepository } from '../key-source.repository';
import { getNextAvailableIndex } from './utils';

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

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

export type ChainweaverContext = {
  encryptionKey: Uint8Array;
  encryptedPassword: Uint8Array;
};

export function createChainweaverService() {
  let context:
    | (ChainweaverContext & {
        cache: Map<string, IKeyPair>;
      })
    | null = null;

  return {
    isConnected: () => Boolean(context),
    disconnect: () => {
      context = null;
    },

    clearCache: () => {
      if (context) {
        context.cache = new Map();
      }
    },

    import: async (
      profileId: string,
      rootKey: string,
      password: string,
      keyPairs: { index: number; private: string; public: string }[],
    ) => {
      // check if password is correct
      const checkKeyPair = keyPairs[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [__private, publickey] = await legacyKadenaGenKeypair(
        password,
        Buffer.from(rootKey, 'hex'),
        0x80000000 + checkKeyPair.index,
      );

      if (checkKeyPair.public !== Buffer.from(publickey).toString('hex')) {
        throw new Error('Invalid password');
      }

      // encrypt legacy rootKey
      const rootKeyId = crypto.randomUUID();
      const encryptedRootKeyBuffer = await kadenaEncrypt(
        password,
        Buffer.from(rootKey, 'hex'),
        'buffer',
      );
      await keySourceRepository.addEncryptedValue(
        rootKeyId,
        encryptedRootKeyBuffer,
      );

      // store keys
      const newKeyPairs = await Promise.all(
        keyPairs.map(async (keyPair) => {
          const secretId = crypto.randomUUID();
          await keySourceRepository.addEncryptedValue(
            secretId,
            await kadenaEncrypt(password, Buffer.from(keyPair.private, 'hex')),
          );
          const key = {
            index: keyPair.index,
            publicKey: keyPair.public,
            secretId,
          };
          return key;
        }),
      );

      // store encrypted rootKey
      const keySource: IHDChainweaver = {
        uuid: crypto.randomUUID(),
        profileId,
        source: 'HD-chainweaver',
        keys: newKeyPairs,
        rootKeyId,
      };
      await keySourceRepository.addKeySource(keySource);

      return keySource;
    },

    changePassword: async (
      keysetId: string,
      oldPassword: string,
      newPassword: string,
    ) => {
      try {
        const keySource = await keySourceRepository.getKeySource(keysetId);
        if (keySource.source !== 'HD-chainweaver') {
          return;
        }
        const rootKey = await keySourceRepository.getEncryptedValue(
          keySource.rootKeyId,
        );

        const newRootKey = await kadenaChangePassword(
          rootKey,
          oldPassword,
          newPassword,
        );

        const newKeys = await Promise.all(
          keySource.keys.map(async (key) => {
            const secretKey = await keySourceRepository.getEncryptedValue(
              key.secretId,
            );

            const newSecretKey = await kadenaChangePassword(
              secretKey,
              oldPassword,
              newPassword,
            );

            return () =>
              keySourceRepository.updateEncryptedValue(
                key.secretId,
                newSecretKey,
              );
          }),
        );

        // update all keys in repository
        return Promise.all([
          newKeys.map((update) => update()),
          keySourceRepository.updateEncryptedValue(
            keySource.rootKeyId,
            newRootKey,
          ),
        ]);
      } catch (e) {
        throw new Error(`Error changing password
${(e as any).message}`);
      }
    },

    register: async (
      profileId: string,
      mnemonic: string,
      password: string,
      mnemonicIsRootkey: boolean = false,
    ): Promise<IHDChainweaver> => {
      const rootKeyId = crypto.randomUUID();
      const secretId = crypto.randomUUID();

      let encryptedRootKey;
      // TODO undo mnemonicIsRootkey
      // take from main branch
      if (mnemonicIsRootkey) {
        // when importing from Chainweaver export file,
        //   we have no access to the mnemonic
        encryptedRootKey = mnemonic;
      } else {
        const encryptedMnemonic = await kadenaEncrypt(
          password,
          mnemonic,
          'buffer',
        );
        encryptedRootKey = await kadenaMnemonicToRootKeypair(
          password,
          mnemonic,
          'buffer',
        );
        await keySourceRepository.addEncryptedValue(
          secretId,
          encryptedMnemonic,
        );
      }
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
      console.log('Connected to HD-chainweaver key source');
      context = await createContext(password);
    },

    getPublicKey: async (
      keySource: IKeySource | IHDChainweaver,
      startIndex: number,
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
      const key = await kadenaGenKeypair(password, rootKey, startIndex);
      context.cache.set(`${keySource.uuid}-${startIndex}`, key);
      const newKey = {
        publicKey: key.publicKey,
        index: startIndex,
      };
      return newKey;
    },

    createKey: async (keySourceId: string, index?: number) => {
      console.log('createKey', keySourceId, index);
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const keySource = await keySourceRepository.getKeySource(keySourceId);
      if (!keySource || keySource.source !== 'HD-chainweaver') {
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

      const password = await decryptPassword(context);
      const rootKey = await keySourceRepository.getEncryptedValue(
        keySource.rootKeyId,
      );
      const key = context.cache.has(`${keySourceId}-${keyIndex}`)
        ? (context.cache.get(`${keySourceId}-${keyIndex}`) as IKeyPair)
        : await kadenaGenKeypair(password, rootKey, keyIndex);

      const secretId = crypto.randomUUID();
      await keySourceRepository.addEncryptedValue(
        secretId,
        Buffer.from(key.secretKey, 'base64'),
      );
      const newKey = {
        publicKey: key.publicKey,
        index: keyIndex,
        secretId,
      };
      keySource.keys.push(newKey);
      await keySourceRepository.updateKeySource(keySource);
      return newKey;
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
          sig: Buffer.from(
            await kadenaSign(password, message, key.secretKey),
          ).toString('hex'),
          pubKey: key.publicKey,
        })),
      );

      return result;
    },
  };
}

export type ChainweaverService = ReturnType<typeof createChainweaverService>;
