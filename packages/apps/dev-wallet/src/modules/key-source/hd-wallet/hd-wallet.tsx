import { IKeySource, KeySourceType } from '@/modules/wallet/wallet.repository';
import { keySourceManager } from '../key-source-manager';
import { IHDBIP44, IHDChainweaver } from '../key-source.repository';
import { BIP44Service } from './BIP44';
import { ChainweaverService } from './chainweaver';

export const useHDWallet = () => {
  const createHDWallet = async (
    profileId: string,
    type: 'HD-BIP44' | 'HD-chainweaver',
    password: string,
    mnemonic: string,
    derivationPathTemplate?: string,
  ) => {
    switch (type) {
      case 'HD-BIP44': {
        const service = (await keySourceManager.get(type)) as BIP44Service;
        const keySource = await service.register(
          profileId,
          mnemonic,
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
        const keySource = await service.register(profileId, mnemonic, password);
        return keySource;
      }
      default:
        throw new Error('Unsupported key source type');
    }
  };

  const unlockHDWallet = async (
    type: KeySourceType,
    password: string,
    keySource: IKeySource,
  ) => {
    switch (type) {
      case 'HD-BIP44': {
        const service = (await keySourceManager.get(type)) as BIP44Service;
        await service.connect(password, keySource as unknown as IHDBIP44);
        break;
      }
      case 'HD-chainweaver': {
        const service = (await keySourceManager.get(
          type,
        )) as ChainweaverService;
        await service.connect(password, keySource as unknown as IHDChainweaver);
        break;
      }
      default:
        throw new Error('Unsupported key source type');
    }
  };
  return { createHDWallet, unlockHDWallet };
};
