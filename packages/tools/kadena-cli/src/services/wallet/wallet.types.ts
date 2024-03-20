import type { z } from 'zod';
import type { walletSchema } from './wallet.schemas.js';

export interface IWallet {
  alias: string;
  filepath: string;
  legacy: boolean;
  mnemonic: string;
  version: number;
  keys: {
    publicKey: string;
    index: number;
    alias?: string;
  }[];
}

export type IWalletCreate = Omit<IWallet, 'filepath' | 'keys' | 'version'>;

export type IWalletFile = z.output<typeof walletSchema>;
