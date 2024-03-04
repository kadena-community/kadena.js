import { IKeySource } from '../wallet/wallet.repository';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(source: IKeySource['source']): Promise<IKeySourceService>;
  reset(): void;
}

function createKeySourceManager(): IKeySourceManager {
  let bip44: IKeySourceService;
  let chainweaver: IKeySourceService;
  return {
    async get(
      source: 'HD-BIP44' | 'HD-chainweaver',
    ): Promise<IKeySourceService> {
      switch (source) {
        case 'HD-BIP44':
          if (bip44) return bip44;
          return import('./hd-wallet/BIP44').then((module) => {
            bip44 = module.createBIP44Service();
            return bip44;
          });

        case 'HD-chainweaver':
          if (chainweaver) return chainweaver;
          return import('./hd-wallet/chainweaver').then((module) => {
            chainweaver = module.createChainweaverService();
            return chainweaver;
          });
        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
    reset() {
      bip44?.disconnect();
      chainweaver?.disconnect();
    },
  };
}

export const keySourceManager = createKeySourceManager();
