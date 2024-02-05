import { createDatabaseConnection } from '@/modules/db/db.service';
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
  keySourceId: string;
}

export interface IKeySource {
  uuid: string;
  derivationPathTemplate: string;
  source: 'hd-wallet';
  publicKeys: string[];
}

export interface IProfile {
  uuid: string;
  name: string;
  networks: INetwork[];
  seedKey: string;
  keySources: IKeySource[];
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
  disconnect: () => Promise<void>;
  getAllProfiles: () => Promise<Exclude<IProfile, 'networks'>[]>;
  getProfile: (id: string) => Promise<IProfile>;
  addProfile: (profile: IProfile) => Promise<void>;
  updateProfile: (profile: IProfile) => Promise<void>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
  addAccount: (account: IAccount) => Promise<void>;
  getAccountsByProfileId: (profileId: string) => Promise<IAccount[]>;
}

const walletRepository = (db: IDBDatabase): WalletRepository => {
  const getAll = getAllItems(db);
  const getOne = getOneItem(db);
  const add = addItem(db);
  const update = updateItem(db);

  return {
    disconnect: async (): Promise<void> => {
      db.close();
    },
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

export const createWalletRepository = async () => {
  const db = await createDatabaseConnection();
  return walletRepository(db);
};
