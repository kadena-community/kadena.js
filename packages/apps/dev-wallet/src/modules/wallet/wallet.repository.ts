import { injectDb } from '@/modules/db/db.service';
import {
  addItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { BuiltInPredicate } from '@kadena/client';
import { INetwork } from '../network/network.repository';

export interface IKeyItem {
  publicKey: string;
  index: number;
}

export type KeySourceType = 'HD-BIP44' | 'HD-chainweaver';

export interface IKeySource {
  uuid: string;
  source: KeySourceType;
  keys: Array<{
    id?: string;
    index: number;
    publicKey: string;
  }>;
}

export interface IProfile {
  uuid: string;
  name: string;
  networks: INetwork[];
  keySources: IKeySource[];
  // TODO: maybe we should move this to the keySources
  secretId: string;
}

export interface IKeySetGuard {
  type: 'keySet';
  publicKeys: Array<IKeyItem>;
  pred: BuiltInPredicate;
}

export interface IAccount {
  uuid: string;
  profileId: string;
  alias?: string;
  address: string;
  guard: IKeySetGuard; // this could be extended to support other guards
}

export interface WalletRepository {
  getAllProfiles: () => Promise<Exclude<IProfile, 'networks'>[]>;
  getProfile: (id: string) => Promise<IProfile>;
  addProfile: (profile: IProfile) => Promise<void>;
  updateProfile: (profile: IProfile) => Promise<void>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
  addAccount: (account: IAccount) => Promise<void>;
  getAccountsByProfileId: (profileId: string) => Promise<IAccount[]>;
}

const createWalletRepository = (): WalletRepository => {
  const getAll = injectDb(getAllItems);
  const getOne = injectDb(getOneItem);
  const add = injectDb(addItem);
  const update = injectDb(updateItem);

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
    addAccount: async (account: IAccount): Promise<void> => {
      return add('account', account);
    },
    getAccountsByProfileId(profileId: string): Promise<IAccount[]> {
      return getAll('account', profileId, 'profileId');
    },
  };
};

export const walletRepository = createWalletRepository();
