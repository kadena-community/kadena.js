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
  profileId: string;
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
  HDWalletSeedKey: string;
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
  createTransactionContext: () => WalletRepositoryTx;
  getAllProfiles: () => Promise<Exclude<IProfile, 'networks'>[]>;
  getProfile: (id: string) => Promise<IProfile>;
  getKeySourcesByProfileId: (profileId: string) => Promise<IKeySource[]>;
  addKeySource: (keySource: IKeySource) => Promise<void>;
  getKeySource: (key: string) => Promise<IKeySource>;
  updateKeySource: (keySource: IKeySource) => Promise<void>;
  addProfile: (profile: IProfile) => Promise<void>;
  updateProfile: (profile: IProfile) => Promise<void>;
  getNetworkList: () => Promise<INetwork[]>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
  addAccount: (account: IAccount) => Promise<void>;
  getAccountsByProfileId: (profileId: string) => Promise<IAccount[]>;
}

export interface WalletRepositoryTx
  extends Omit<WalletRepository, 'createTransactionBase' | 'disconnect'> {
  commit: () => void;
  abort: () => void;
}

export const walletRepository = (
  db: IDBDatabase,
  activeTransaction?: IDBTransaction,
): WalletRepository => {
  const getAll = getAllItems(db, activeTransaction);
  const getOne = getOneItem(db, activeTransaction);
  const add = addItem(db, activeTransaction);
  const update = updateItem(db, activeTransaction);

  return {
    disconnect: async (): Promise<void> => {
      db.close();
    },
    createTransactionContext: (
      sources = [
        'profile',
        'network',
        'keySource',
        'encryptedValue',
        'account',
      ],
    ) => {
      const tx = db.transaction(sources, 'readwrite');
      return {
        ...walletRepository(db, tx),
        disconnect: async () => {},
        commit: () => tx.commit(),
        abort: () => tx.abort(),
      };
    },
    getAllProfiles: async (): Promise<Exclude<IProfile, 'networks'>[]> => {
      return getAll('profile');
    },
    getProfile: async (id: string): Promise<IProfile> => {
      return getOne('profile', id);
    },
    getKeySourcesByProfileId: async (
      profileId: string,
    ): Promise<IKeySource[]> => {
      return getAll('keySource', profileId, 'profileId');
    },
    addKeySource: async (keySource: IKeySource): Promise<void> => {
      return add('keySource', keySource);
    },
    getKeySource: async (key: string): Promise<IKeySource> => {
      return getOne('keySource', key);
    },
    updateKeySource: async (keySource: IKeySource): Promise<void> => {
      return update('keySource', keySource);
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
    const DB_VERSION = 5;
    let { db, needsUpgrade } = await connect(DB_NAME, DB_VERSION);
    if (needsUpgrade) {
      console.log('needs upgrade');
      if (import.meta.env.DEV) {
        console.log(
          'LOG:in development we delete the database if schema is changed for now since we are still in early stage of development',
        );
        db.close();
        console.log('deleting database');
        await deleteDatabase(DB_NAME);
        console.log('creating new database');
        let { db: newDb } = await connect(DB_NAME, DB_VERSION);
        db = newDb;
      }
      // NOTE: If you change the schema, you need to update the upgrade method
      // below to migrate the data. the current version just creates the database
      console.log('creating object stores');
      const create = createStore(db);
      create('profile', 'uuid', [{ index: 'name', unique: true }]);
      create('network', 'uuid');
      create('keySource', 'uuid', [
        { index: 'profileId', unique: false },
        {
          index: 'uniqueKeySource',
          indexKeyPath: ['profileId', 'derivationPathTemplate', 'source'],
          unique: true,
        },
      ]);
      create('encryptedValue');
      // TODO: move account to separate repository if needed
      create('account', 'uuid', [{ index: 'address' }, { index: 'profileId' }]);
    }
    return walletRepository(db);
  },
);
