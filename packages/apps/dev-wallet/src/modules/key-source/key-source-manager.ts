import { IKeySource } from '../wallet/wallet.repository';
import { BIP44Context } from './hd-wallet/BIP44';
import { ChainweaverContext } from './hd-wallet/chainweaver';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(
    source: IKeySource['source'],
    context?: unknown,
  ): Promise<IKeySourceService>;
  reset(): void;
}

function createKeySourceManager(): IKeySourceManager {
  let bip44: IKeySourceService | undefined;
  let chainweaver: IKeySourceService | undefined;
  return {
    async get(
      source: 'HD-BIP44' | 'HD-chainweaver',
      context?: unknown,
    ): Promise<IKeySourceService> {
      switch (source) {
        case 'HD-BIP44':
          if (bip44 && !context) return bip44;
          return import('./hd-wallet/BIP44').then((module) => {
            bip44 = module.createBIP44Service(context as BIP44Context);
            return bip44;
          });

        case 'HD-chainweaver':
          if (chainweaver && !context) return chainweaver;
          return import('./hd-wallet/chainweaver').then((module) => {
            chainweaver = module.createChainweaverService(
              context as ChainweaverContext,
            );
            return chainweaver;
          });
        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
    reset() {
      bip44?.disconnect();
      chainweaver?.disconnect();
      bip44 = undefined;
      chainweaver = undefined;
    },
  };
}

export const keySourceManager = createKeySourceManager();
