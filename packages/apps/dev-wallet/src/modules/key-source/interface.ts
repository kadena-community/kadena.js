import { IKeySource } from '../wallet/wallet.repository';

export type KeySourceWithSecret = Omit<IKeySource, 'secret'> & {
  secret: Uint8Array;
};

export interface IKeySourceService<
  TSource extends KeySourceWithSecret = KeySourceWithSecret,
> {
  isReady: () => boolean;
  serviceId: (keySource: IKeySource) => string;
  createKey: (
    keySource: TSource,
    quantity: number,
  ) => Promise<
    Array<{
      index: number;
      publicKey: string;
    }>
  >;
  sign(
    message: string,
    keySource: TSource,
    indexes: number[],
  ): Promise<Array<{ sig: string; pubKey: string }>>;
}
