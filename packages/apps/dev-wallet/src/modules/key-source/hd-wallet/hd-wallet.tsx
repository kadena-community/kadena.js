import { keySourceManager } from '../key-source-manager';
import { BIP44Service } from './BIP44';
import { ChainweaverService } from './chainweaver';

export const useHDWallet = () => {
  const createHDWallet = async (
    profileId: string,
    type: 'HD-BIP44' | 'HD-chainweaver',
    password: string,
    derivationPathTemplate?: string,
  ) => {
    switch (type) {
      case 'HD-BIP44': {
        const service = (await keySourceManager.get(type)) as BIP44Service;
        const keySource = await service.register(
          profileId,
          password,
          derivationPathTemplate,
        );
        return keySource;
      }
      case 'HD-chainweaver': {
        if (derivationPathTemplate) {
          throw new Error('Chainweaver does not support derivation path');
        }
        const service = (await keySourceManager.get(
          type,
        )) as ChainweaverService;
        const keySource = await service.register(profileId, password);
        return keySource;
      }
      default:
        throw new Error('Unsupported key source type');
    }
  };

  return { createHDWallet };
};
