import type { EncryptedString } from '@kadena/hd-wallet';
import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';
import {
  kadenaChangePassword,
  kadenaGenKeypair,
  kadenaGenMnemonic as legacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

import { toHexStr } from '../../keys/utils/keysHelpers.js';
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
  getByAlias: (alias: string) => Promise<IWallet | null>;
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
  changePassword: (
    wallet: IWallet,
    currentPassword: string,
    newPassword: string,
  ) => Promise<IWallet>;
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
    return this._createFromSeed({ alias, legacy, seed });
  }

  public async get(filepath: string): ReturnType<IWalletService['get']> {
    return this.services.config.getWallet(filepath);
  }

  public async getByAlias(
    alias: string,
  ): ReturnType<IWalletService['getByAlias']> {
    const wallets = await this.services.config.getWallets();
    return wallets.find((wallet) => wallet.alias === alias) ?? null;
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
    const newWallet = { ...wallet, keys };
    await this.services.config.setWallet(newWallet, true);
    return newWallet;
  }

  public async getKeyPair(
    wallet: IWallet,
    key: IWalletKey,
    password: string,
  ): ReturnType<IWalletService['getKeyPair']> {
    const keypair = await this._generateKey({
      seed: wallet.seed,
      legacy: wallet.legacy,
      password,
      index: key.index,
    });

    return {
      publicKey: keypair.publicKey,
      secretKey: toHexStr(await kadenaDecrypt(password, keypair.secretKey)),
    };
  }

  public async changePassword(
    wallet: IWallet,
    currentPassword: string,
    newPassword: string,
  ): ReturnType<IWalletService['changePassword']> {
    const encryptedSeed = await (async () => {
      if (wallet.legacy === true) {
        return await kadenaChangePassword(
          wallet.seed,
          currentPassword,
          newPassword,
        );
      } else {
        const decryptedSeed = await kadenaDecrypt(currentPassword, wallet.seed);
        return await kadenaEncrypt(newPassword, decryptedSeed);
      }
    })();
    const newWallet = { ...wallet, seed: encryptedSeed };
    await this.services.config.setWallet(newWallet, true);
    return newWallet;
  }

  private async _createFromSeed({
    alias,
    legacy,
    seed,
  }: IWalletCreateFromSeed): Promise<IWallet> {
    const walletCreate = {
      alias,
      legacy,
      seed,
      keys: [],
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
