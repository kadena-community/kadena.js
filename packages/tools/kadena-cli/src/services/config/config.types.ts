import type { IKeyPair } from '@kadena/types';
import type { z } from 'zod';
import type { IWallet } from '../wallet/wallet.types.js';
import type { plainKeySchema } from './config.schemas.js';

/** The data written to disk for a Plain Key */
export type IPlainKeyFile = z.output<typeof plainKeySchema>;

/** Plain Key. represents a stored stand-alone key pair */
export type IPlainKey = IKeyPair & {
  alias: string;
  filepath: string;
  legacy: boolean;
};

/** Required arguments for storing a new Plain Key */
export type IPlainKeyCreate = Omit<IPlainKey, 'filepath'>;

export type IWalletCreate = Omit<IWallet, 'filepath' | 'version'>;
