import { IDBService, dbService } from '@/modules/db/db.service';
import type { INetwork } from '../network/network.repository';

export interface IKeyItem {
  publicKey: string;
  index: number;
}

export type KeySourceType = 'HD-BIP44' | 'HD-chainweaver';

export interface IKeyItem {
  index: number;
  publicKey: string;
}

export interface IKeySource {
  uuid: string;
  profileId: string;
  source: KeySourceType;
  keys: Array<IKeyItem>;
}

export interface IProfile {
  uuid: string;
  name: string;
  networks: INetwork[];
  secretId: string;
  accentColor: string;
}

const createWalletRepository = ({
  getAll,
  getOne,
  add,
  update,
}: IDBService) => {
  return {
    getAllProfiles: async (): Promise<Exclude<IProfile, 'networks'>[]> => {
      return getAll('profile');
    },
    getProfile: async (id: string): Promise<IProfile> => {
      return getOne('profile', id);
    },
    addProfile: async (profile: IProfile): Promise<void> => {
      return add('profile', profile);
    },
    updateProfile: async (profile: IProfile): Promise<void> => {
      return update('profile', profile);
    },
    getEncryptedValue: async (key: string): Promise<Uint8Array> => {
      return getOne('encryptedValue', key);
    },
    addEncryptedValue: async (
      key: string,
      value: string | Uint8Array,
    ): Promise<void> => {
      return add('encryptedValue', value, key);
    },
    getProfileKeySources: async (profileId: string): Promise<IKeySource[]> => {
      return getAll('keySource', profileId, 'profileId');
    },
    getKeySource: async (keySourceId: string): Promise<IKeySource> => {
      return getOne('keySource', keySourceId);
    },
  };
};

export const walletRepository = createWalletRepository(dbService);
