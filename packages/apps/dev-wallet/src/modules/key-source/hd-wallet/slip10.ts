import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
  randomBytes,
} from '@kadena/hd-wallet';
import { IKeySourceService } from '../interface';

export const DEFAULT_DERIVATION_PATH_TEMPLATE = `m'/44'/626'/<index>'`;

export interface ISlip10KeySource {
  uuid: string;
  derivationPathTemplate: string;
  source: 'hd-wallet-slip10';
  secret: Uint8Array;
  keys: Array<{
    index: number;
    publicKey: string;
  }>;
}

const createContext = async (mnemonic: string) => {
  const encryptionKey = randomBytes(32);
  const encryptedSeed = await kadenaMnemonicToSeed(
    encryptionKey,
    mnemonic,
    'buffer',
  );
  return { encryptionKey, encryptedSeed };
};

export interface ISlip10Service extends IKeySourceService<ISlip10KeySource> {
  register: (
    mnemonic: string,
    password: string,
    derivationPathTemplate?: string,
  ) => Promise<ISlip10KeySource>;
  connect: (password: string, keySource: ISlip10KeySource) => Promise<void>;
}

export function createSlip10Service(): ISlip10Service {
  let context: {
    encryptionKey: Uint8Array;
    encryptedSeed: Uint8Array;
  } | null = null;

  return {
    isReady: () => Boolean(context),
    serviceId: (
      config: Pick<ISlip10KeySource, 'source' | 'derivationPathTemplate'>,
    ) => `${config.source}:${config.derivationPathTemplate}`,
    register: async (
      mnemonic: string,
      password: string,
      derivationPathTemplate: string = DEFAULT_DERIVATION_PATH_TEMPLATE,
    ): Promise<ISlip10KeySource> => {
      const encryptedMnemonic = await kadenaEncrypt(
        password,
        mnemonic,
        'buffer',
      );
      const keySource: ISlip10KeySource = {
        uuid: crypto.randomUUID(),
        source: 'hd-wallet-slip10',
        derivationPathTemplate,
        keys: [],
        secret: encryptedMnemonic,
      };
      context = await createContext(mnemonic);
      return keySource;
    },

    connect: async (password: string, keySource: ISlip10KeySource) => {
      const decryptedMnemonicBuffer = await kadenaDecrypt(
        password,
        keySource.secret,
      );
      const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
      context = await createContext(mnemonic);
    },

    createKey: async (keySource: ISlip10KeySource, quantity: number = 1) => {
      if (!context) {
        throw new Error('Wallet not unlocked');
      }
      const startIndex = keySource.keys.length;
      const publicKeys = await kadenaGetPublic(
        context.encryptionKey,
        context.encryptedSeed,
        [startIndex, startIndex + quantity - 1],
        keySource.derivationPathTemplate,
      );
      return publicKeys.map((publicKey, index) => ({
        publicKey,
        index: startIndex + index,
      }));
    },

    sign(message: string, keySource: ISlip10KeySource, indexes: number[]) {
      if (!context) {
        throw new Error('Wallet not unlocked');
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
