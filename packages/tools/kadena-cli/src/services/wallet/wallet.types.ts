import type { EncryptedString } from '@kadena/hd-wallet';
import type { z } from 'zod';
import type { walletSchema } from './wallet.schemas.js';

export interface IWalletKey {
  publicKey: string;
  index: number;
  alias?: string;
}

export interface IWalletKeyPair {
  publicKey: string;
  secretKey: EncryptedString;
}

export interface IWallet {
  alias: string;
  filepath: string;
  legacy: boolean;
  seed: EncryptedString;
  version: number;
  keys: IWalletKey[];
}

export type IWalletCreate = Pick<IWallet, 'alias' | 'legacy'> & {
  password: string;
};

export type IWalletImport = IWalletCreate & {
  mnemonic: string;
};

export type IWalletCreateFromSeed = IWalletCreate & {
  seed: EncryptedString;
};

export type IWalletKeyCreate = Pick<IWallet, 'seed' | 'legacy'> & {
  password: string;
  index: number;
  alias?: string;
};

export type IWalletFile = z.output<typeof walletSchema>;
