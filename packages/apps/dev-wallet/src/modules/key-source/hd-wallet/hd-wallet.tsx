import { IKeySource, KeySourceType } from '@/modules/wallet/wallet.repository';
import { setSession } from '@/utils/session';
import { keySourceManager } from '../key-source-manager';
import { IHDBIP44, IHDChainweaver } from '../key-source.repository';
import { BIP44Service } from './BIP44';
import { ChainweaverService } from './chainweaver';

export const createHDWallet = async (
  profileId: string,
  type: KeySourceType,
  password: string,
  mnemonic: string,
  derivationPathTemplate?: string,
) => {
  console.log('creating hd wallet', type);
  switch (type) {
    case 'HD-BIP44': {
      const service = (await keySourceManager.get(type)) as BIP44Service;
      const reg = await service.register(
        profileId,
        mnemonic,
        password,
        derivationPathTemplate,
      );

      await setSession(`${profileId}-${type}`, service.getContext());
      return reg;
    }
    case 'HD-chainweaver': {
      if (derivationPathTemplate) {
        throw new Error('Chainweaver does not support derivation path');
      }
      const service = (await keySourceManager.get(type)) as ChainweaverService;
      const reg = service.register(profileId, mnemonic, password);
      await setSession(`${profileId}-${type}`, service.getContext());
      return reg;
    }
    default:
      throw new Error('Unsupported key source type');
  }
};

export const unlockHDWallet = async (
  type: KeySourceType,
  password: string,
  keySource: IKeySource,
) => {
  console.log('unlocking hd wallet', type);
  switch (type) {
    case 'HD-BIP44': {
      const service = (await keySourceManager.get(type)) as BIP44Service;
      await service.connect(password, keySource as unknown as IHDBIP44);
      await setSession(`${keySource.profileId}-${type}`, service.getContext());
      break;
    }
    case 'HD-chainweaver': {
      const service = (await keySourceManager.get(type)) as ChainweaverService;
      await service.connect(password, keySource as unknown as IHDChainweaver);
      await setSession(`${keySource.profileId}-${type}`, service.getContext());
      break;
    }
    default:
      throw new Error('Unsupported key source type');
  }
};
