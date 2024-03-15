import { IKeySource, KeySourceType } from '@/modules/wallet/wallet.repository';
import { useCallback } from 'react';
import { keySourceManager } from '../key-source-manager';
import { IHDBIP44, IHDChainweaver } from '../key-source.repository';
import { BIP44Service } from './BIP44';
import { ChainweaverService } from './chainweaver';

export const useHDWallet = () => {
  const createHDWallet = useCallback(
    async (
      profileId: string,
      type: KeySourceType,
      password: string,
      mnemonic: string,
      derivationPathTemplate?: string,
    ) => {
      switch (type) {
        case 'HD-BIP44': {
          const service = (await keySourceManager.get(type)) as BIP44Service;
          return service.register(
            profileId,
            mnemonic,
            password,
            derivationPathTemplate,
          );
        }
        case 'HD-chainweaver': {
          if (derivationPathTemplate) {
            throw new Error('Chainweaver does not support derivation path');
          }
          const service = (await keySourceManager.get(
            type,
          )) as ChainweaverService;
          return service.register(profileId, mnemonic, password);
        }
        default:
          throw new Error('Unsupported key source type');
      }
    },
    [],
  );

  const unlockHDWallet = useCallback(
    async (type: KeySourceType, password: string, keySource: IKeySource) => {
      switch (type) {
        case 'HD-BIP44': {
          const service = (await keySourceManager.get(type)) as BIP44Service;
          return service.connect(password, keySource as unknown as IHDBIP44);
        }
        case 'HD-chainweaver': {
          const service = (await keySourceManager.get(
            type,
          )) as ChainweaverService;
          return service.connect(
            password,
            keySource as unknown as IHDChainweaver,
          );
        }
        default:
          throw new Error('Unsupported key source type');
      }
    },
    [],
  );

  return {
    createHDWallet,
    unlockHDWallet,
  };
};
