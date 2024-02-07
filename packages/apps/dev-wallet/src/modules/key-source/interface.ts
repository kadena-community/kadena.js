import { IKeySource } from '../wallet/wallet.repository';

export interface ISecretRepository {
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
}

export interface IKeySourceService {
  isReady: () => boolean;
  createKey: (
    keySourceId: string,
    quantity: number,
  ) => Promise<IKeySource['keys']>;
  sign(
    message: string,
    keySourceId: string,
    indexes: number[],
  ): Promise<Array<{ sig: string; pubKey: string }>>;
}
