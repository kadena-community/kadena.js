import {
  addItem,
  connect,
  createStore,
  deleteDatabase,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/utils/indexeddb';
import { BuiltInPredicate } from '@kadena/client';

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

export interface INetwork {
  uuid: string;
  networkId: string;
  hosts: Array<{
    url: string;
    useFor: {
      submit: boolean;
      read: boolean;
      confirmation: boolean;
    };
    priority: number;
  }>;
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
  getNetworkList: () => Promise<INetwork[]>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
  addAccount: (account: IAccount) => Promise<void>;
  getAccountsByProfileId: (profileId: string) => Promise<IAccount[]>;
}

export interface WalletRepositoryTx
  extends Omit<WalletRepository, 'createTransactionContext' | 'disconnect'> {
  abort: () => void;
}

export const walletRepository = (db: IDBDatabase): WalletRepository => {
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
    getNetworkList: async (): Promise<INetwork[]> => {
      return getAll('network');
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

const asyncGuard = <Args extends any[], T>(
  fn: (...args: Args) => Promise<T>,
) => {
  let promise: Promise<T> | null = null;
  return async (...args: Args) => {
    if (promise) return promise;
    promise = fn(...args);
    promise.finally(() => {
      promise = null;
    });
    return promise;
  };
};

export const createWalletRepository = asyncGuard(
  async (): Promise<WalletRepository> => {
    const DB_NAME = 'dev-wallet';
    const DB_VERSION = 6;
    const result = await connect(DB_NAME, DB_VERSION);
    let { db } = result;
    if (result.needsUpgrade) {
      console.log('needs upgrade');
      if (import.meta.env.DEV) {
        console.log(
          'LOG:in development we delete the database if schema is changed for now since we are still in early stage of development',
        );
        db.close();
        console.log('deleting database');
        await deleteDatabase(DB_NAME);
        console.log('creating new database');
        const { db: newDb } = await connect(DB_NAME, DB_VERSION);
        db = newDb;
      }
      // NOTE: If you change the schema, you need to update the upgrade method
      // below to migrate the data. the current version just creates the database
      console.log('creating object stores');
      const create = createStore(db);
      create('profile', 'uuid', [{ index: 'name', unique: true }]);
      create('network', 'uuid');
      create('encryptedValue');
      // TODO: move account to separate repository if needed
      create('account', 'uuid', [{ index: 'address' }, { index: 'profileId' }]);
    }
    return walletRepository(db);
  },
);
