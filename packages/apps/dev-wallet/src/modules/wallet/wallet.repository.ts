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

export interface Token {
  uuid: string;
  name: string;
  networkId: string;
  contract: string;
}

const createWalletRepository = () => {
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
    getProfileKeySources: async (profileId: string): Promise<IKeySource[]> => {
      return getAll('keySource', profileId, 'profileId');
    },
    getKeySource: async (keySourceId: string): Promise<IKeySource> => {
      return getOne('keySource', keySourceId);
    },
    addToken: async (token: Token): Promise<void> => {
      return add('token', token);
    },
    getTokenList: async (): Promise<Token[]> => {
      return getAll('token');
    },
  };
};

export const walletRepository = createWalletRepository();
