import { IKeyItem, IKeySource } from '../wallet/wallet.repository';

export interface ISecretRepository {
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
}

export interface IKeySourceService {
  isConnected: () => boolean;
  disconnect: () => void | Promise<void>;
  createKey: (keySourceId: string, index?: number) => Promise<IKeyItem>;
  sign(
    keySourceId: string,
    message: string,
    indexes: number[],
  ): Promise<Array<{ sig: string; pubKey: string }>>;

  getPublicKey: (keySource: IKeySource, index: number) => Promise<IKeyItem>;
  clearCache: () => void | Promise<void>;
  getContext: () => Record<string, unknown> | null;
}
