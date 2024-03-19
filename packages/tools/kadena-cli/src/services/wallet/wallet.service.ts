import type { Services } from '../index.js';
import { WALLET_SCHEMA_VERSION } from './wallet.schemas.js';
import type { IWallet, IWalletCreate } from './wallet.types.js';

export interface IWalletService {
  get: (filepath: string) => Promise<IWallet | null>;
  list: () => Promise<IWallet[]>;
  set: (wallet: IWalletCreate) => Promise<IWallet>;
  delete: (filepath: string) => Promise<void>;
}

export class WalletService implements IWalletService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  public async set(wallet: IWalletCreate): ReturnType<IWalletService['set']> {
    const filepath = await this.services.config.setWallet(wallet);
    return {
      filepath,
      version: WALLET_SCHEMA_VERSION,
      keys: [],
      ...wallet,
    };
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
}
