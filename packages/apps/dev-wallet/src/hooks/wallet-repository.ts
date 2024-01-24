import {
  connect,
  createStore,
  getAllItems,
  getOneItem,
  saveItem,
} from '@/utils/db';

export interface IHDKey {
  index: number;
  publicKey: string;
}

export interface KeyStore {
  uuid: string;
  profileId: string;
  seedKey: string;
  derivationPathTemplate: string;
  source: 'hd-wallet';
  keys: IHDKey[];
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
  id: string;
  name: string;
  networks: INetwork[];
  keyStore: KeyStore[];
}

const walletRepository = (db: IDBDatabase) => {
  const getAll = getAllItems(db);
  const getOne = getOneItem(db);
  const save = saveItem(db);
  return {
    disconnect: async (): Promise<void> => {
      db.close();
    },
    getProfileList: async (): Promise<Exclude<IProfile, 'networks'>[]> => {
      return getAll('profiles');
    },
    getProfile: async (id: string): Promise<IProfile> => {
      return getOne('profiles', id);
    },
    saveProfile: async (profile: IProfile): Promise<void> => {
      return save('profiles', profile);
    },
    getNetworkList: async (): Promise<INetwork[]> => {
      return getAll('networks');
    },
    getEncryptedValue: async (key: string): Promise<Uint8Array> => {
      return getOne('encryptedValues', key);
    },
    saveEncryptedValue: async (
      key: string,
      value: Uint8Array,
    ): Promise<void> => {
      return save('encryptedValues', value, key);
    },
  };
};

export const createWalletRepository = async () => {
  const { db, needsUpgrade } = await connect('dev-wallet', 1);
  if (needsUpgrade) {
    // NOTE: If you change the schema, you need to update the upgrade method
    // below to migrate the data. the current version just creates the database
    const create = createStore(db);
    create('profiles', 'uuid');
    create('networks', 'uuid');
    create('keyStores', 'uuid');
    create('encryptedValues');
  }
  return walletRepository(db);
};
