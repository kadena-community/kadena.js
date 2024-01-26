import {
  addItem,
  connect,
  createStore,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/utils/indexeddb';

export interface KeyStore {
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
  seedKey: string;
}

export interface WalletRepository {
  disconnect: () => Promise<void>;
  getAllProfiles: () => Promise<Exclude<IProfile, 'networks'>[]>;
  getProfile: (id: string) => Promise<IProfile>;
  getKeyStoresByProfileId: (profileId: string) => Promise<KeyStore[]>;
  addKeyStore: (keyStore: KeyStore) => Promise<void>;
  updateKeyStore: (keyStore: KeyStore) => Promise<void>;
  addProfile: (profile: IProfile) => Promise<void>;
  updateProfile: (profile: IProfile) => Promise<void>;
  getNetworkList: () => Promise<INetwork[]>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
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
    getKeyStoresByProfileId: async (profileId: string): Promise<KeyStore[]> => {
      return getAll('keyStore', profileId, 'profileId');
    },
    addKeyStore: async (keyStore: KeyStore): Promise<void> => {
      return add('keyStore', keyStore);
    },
    updateKeyStore: async (keyStore: KeyStore): Promise<void> => {
      return update('keyStore', keyStore);
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
  };
};

export const createWalletRepository = async () => {
  const { db, needsUpgrade } = await connect('dev-wallet', 1);
  if (needsUpgrade) {
    // NOTE: If you change the schema, you need to update the upgrade method
    // below to migrate the data. the current version just creates the database
    const create = createStore(db);
    create('profile', 'uuid', [{ index: 'name', unique: true }]);
    create('network', 'uuid');
    create('keyStore', 'uuid', [{ index: 'profileId', unique: false }]);
    create('encryptedValue');
  }
  return walletRepository(db);
};
