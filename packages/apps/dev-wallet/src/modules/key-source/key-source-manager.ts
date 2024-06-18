import { KeySourceType } from '../wallet/wallet.repository';
import { BIP44Context } from './hd-wallet/BIP44';
import { ChainweaverContext } from './hd-wallet/chainweaver';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(source: KeySourceType, context?: unknown): Promise<IKeySourceService>;
  reset(): void;
}

function createKeySourceManager(): IKeySourceManager {
  const services = new Map<string, IKeySourceService>();
  return {
    async get(
      source: KeySourceType,
      context?: unknown,
    ): Promise<IKeySourceService> {
      if (services.has(source)) {
        return services.get(source) as IKeySourceService;
      }
      switch (source) {
        case 'HD-BIP44':
          return import('./hd-wallet/BIP44').then((module) => {
            const bip44 = module.createBIP44Service(context as BIP44Context);
            services.set(source, bip44);
            return bip44;
          });

        case 'HD-chainweaver':
          return import('./hd-wallet/chainweaver').then((module) => {
            const chainweaver = module.createChainweaverService(
              context as ChainweaverContext,
            );
            services.set(source, chainweaver);
            return chainweaver;
          });
        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
    async reset() {
      await Promise.all(
        [...services.values()].map((service) => service.disconnect()),
      );
      services.clear();
    },
  };
}

export const keySourceManager = createKeySourceManager();
