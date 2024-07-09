import { KeySourceType } from '../wallet/wallet.repository';
import { IKeySourceService } from './interface';

export interface IKeySourceManager {
  get(source: KeySourceType): Promise<IKeySourceService>;
  reset(): void;
}

function createKeySourceManager(): IKeySourceManager {
  const services = new Map<string, IKeySourceService>();
  return {
    async get(source: KeySourceType): Promise<IKeySourceService> {
      if (services.has(source)) {
        return services.get(source) as IKeySourceService;
      }
      switch (source) {
        case 'HD-BIP44':
          return import('./hd-wallet/BIP44').then((module) => {
            const bip44 = module.createBIP44Service();
            services.set(source, bip44);
            return bip44;
          });

        case 'HD-chainweaver':
          return import('./hd-wallet/chainweaver').then((module) => {
            const chainweaver = module.createChainweaverService();
            services.set(source, chainweaver);
            return chainweaver;
          });

        case 'web-authn':
          return import('./web-authn/webauthn').then((module) => {
            const webAuthn = module.createWebAuthnService();
            services.set(source, webAuthn);
            return webAuthn;
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
