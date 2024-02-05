import { IKeySource } from '../wallet/wallet.repository';
import { ISlip10Service, createSlip10Service } from './hd-wallet/slip10';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(source: 'hd-wallet-slip10'): ISlip10Service;
  get(source: string): IKeySourceService<IKeySource & { secret: Uint8Array }>;
}

export function createKeySourceManager(): IKeySourceManager {
  const hdWallet = createSlip10Service();
  return {
    get(source: 'hd-wallet-slip10') {
      switch (source) {
        case 'hd-wallet-slip10':
          return hdWallet as any;

        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
  };
}
