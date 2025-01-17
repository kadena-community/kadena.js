import { KeySourceType } from '../wallet/wallet.repository';
import { createBIP44Service } from './hd-wallet/BIP44';
import { createChainweaverService } from './hd-wallet/chainweaver';
import { IKeySourceService } from './interface';
import { createWebAuthnService } from './web-authn/webauthn';
export interface IKeySourceManager {
  get(source: KeySourceType): Promise<IKeySourceService>;
  reset(): void;
  disconnect(): void;
}

function createKeySourceManager(): IKeySourceManager {
  const services = new Map<string, IKeySourceService>();
  const manager = {
    async get(source: KeySourceType): Promise<IKeySourceService> {
      if (services.has(source)) {
        return services.get(source) as IKeySourceService;
      }
      switch (source) {
        case 'HD-BIP44': {
          const bip44 = createBIP44Service();
          services.set(source, bip44);
          return bip44;
        }

        case 'HD-chainweaver': {
          const chainweaver = createChainweaverService();
          services.set(source, chainweaver);
          return chainweaver;
        }

        case 'web-authn': {
          const webAuthn = createWebAuthnService();
          services.set(source, webAuthn);
          return webAuthn;
        }
        default:
          throw new Error(`Key source service not found for ${source}`);
      }
    },
    async disconnect() {
      await Promise.all(
        [...services.values()].map((service) => service.disconnect()),
      );
    },
    async reset() {
      await manager.disconnect();
      services.clear();
    },
  };
  return manager;
}

export const keySourceManager = createKeySourceManager();
