import { IKeySource } from '../wallet/wallet.repository';
import { createBIP44Service } from './hd-wallet/BIP44';
import { createChainweaverService } from './hd-wallet/chainweaver';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(source: IKeySource['source']): IKeySourceService;
  reset(): void;
}

function createKeySourceManager(): IKeySourceManager {
  const bip44 = createBIP44Service();
  const chainweaver = createChainweaverService();
  return {
    get(source: 'HD-BIP44' | 'HD-chainweaver'): IKeySourceService {
      switch (source) {
        case 'HD-BIP44':
          return bip44;
        case 'HD-chainweaver':
          return chainweaver;

        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
    reset() {
      createBIP44Service().disconnect();
      createChainweaverService().disconnect();
    },
  };
}

export const keySourceManager = createKeySourceManager();
