import type { EncryptedString } from '@kadena/hd-wallet';
import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';
import {
  kadenaGenKeypair,
  kadenaGenMnemonic as legacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

import type { Services } from '../index.js';
import { WALLET_SCHEMA_VERSION } from './wallet.schemas.js';
import type {
  IWallet,
  IWalletCreate,
  IWalletCreateFromSeed,
  IWalletImport,
  IWalletKey,
  IWalletKeyCreate,
  IWalletKeyPair,
} from './wallet.types.js';

export interface IWalletService {
  get: (filepath: string) => Promise<IWallet | null>;
  list: () => Promise<IWallet[]>;
  create: (
    wallet: IWalletCreate,
  ) => Promise<{ wallet: IWallet; words: string }>;
  import: (wallet: IWalletImport) => Promise<IWallet>;
  delete: (filepath: string) => Promise<void>;
  generateKey: (data: IWalletKeyCreate) => Promise<IWalletKey>;
  /** stores given key and mutates key array in wallet */
  storeKey: (wallet: IWallet, key: IWalletKey) => Promise<IWallet>;
  getKeyPair: (
    wallet: IWallet,
    key: IWalletKey,
    password: string,
  ) => Promise<IWalletKeyPair>;
}

export class WalletService implements IWalletService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  public async create({
    alias,
    legacy,
    password,
  }: IWalletCreate): ReturnType<IWalletService['create']> {
    const { words, seed } = await this._generateMnemonic(password, legacy);
    const wallet = await this._createFromSeed({
      alias,
      legacy,
      password,
      seed,
    });
    return { words, wallet };
  }

  public async import({
    alias,
    legacy,
    password,
    mnemonic,
  }: IWalletImport): ReturnType<IWalletService['import']> {
    const seed = await this._mnemonicToSeed(mnemonic, password, legacy);
    return this._createFromSeed({ alias, legacy, password, seed });
  }

  public async get(filepath: string): ReturnType<IWalletService['get']> {
    return this.services.config.getWallet(filepath);
  }

  public async list(): ReturnType<IWalletService['list']> {
    return this.services.config.getWallets();
  }

  public async delete(filepath: string): ReturnType<IWalletService['delete']> {
    return this.services.config.deleteWallet(filepath);
  }

  public async generateKey({
    seed,
    legacy,
    password,
    index,
    alias,
  }: IWalletKeyCreate): ReturnType<IWalletService['generateKey']> {
    const { publicKey } = await this._generateKey({
      seed,
      legacy,
      password,
      index,
    });
    return { publicKey, index, alias };
  }

  public async storeKey(
    wallet: IWallet,
    key: IWalletKey,
  ): ReturnType<IWalletService['storeKey']> {
    const keys = [...wallet.keys, key];
    wallet.keys = keys;
    await this.services.config.setWallet(wallet, true);
    return wallet;
  }

  public async getKeyPair(
    wallet: IWallet,
    key: IWalletKey,
    password: string,
  ): ReturnType<IWalletService['getKeyPair']> {
    return await this._generateKey({
      seed: wallet.seed,
      legacy: wallet.legacy,
      password,
      index: key.index,
    });
  }

  private async _createFromSeed({
    alias,
    legacy,
    password,
    seed,
  }: IWalletCreateFromSeed): Promise<IWallet> {
    const key = await this.generateKey({
      legacy,
      seed,
      password,
      index: 0,
    });
    const walletCreate = {
      alias,
      legacy,
      seed,
      keys: [key],
    };
    const filepath = await this.services.config.setWallet(walletCreate);
    return {
      filepath,
      version: WALLET_SCHEMA_VERSION,
      ...walletCreate,
    };
  }

  private async _generateMnemonic(
    password: string,
    legacy: boolean,
  ): Promise<{ words: string; seed: EncryptedString }> {
    const words = legacy ? legacyKadenaGenMnemonic() : kadenaGenMnemonic();
    return { words, seed: await this._mnemonicToSeed(words, password, legacy) };
  }

  private async _mnemonicToSeed(
    words: string,
    password: string,
    legacy: boolean,
  ): Promise<EncryptedString> {
    if (legacy === true) {
      return await legacykadenaMnemonicToRootKeypair(password, words);
    }
    return await kadenaMnemonicToSeed(password, words);
  }

  private async _generateKey({
    seed,
    legacy,
    password,
    index,
  }: IWalletKeyCreate): Promise<IWalletKeyPair> {
    if (legacy === true) {
      const { publicKey, secretKey } = await kadenaGenKeypair(
        password,
        seed,
        index,
      );
      return { publicKey, secretKey };
    } else {
      const [publicKey, secretKey] = await kadenaGenKeypairFromSeed(
        password,
        seed,
        index,
      );
      return { publicKey, secretKey };
    }
  }
}
