import {
  addItem,
  deleteItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { createDatabaseConnection } from '../db/db.service';

export interface INetwork {
  uuid: string;
  networkId: string;
  name?: string;
  hosts: Array<{
    url: string;
    submit: boolean;
    read: boolean;
    confirm: boolean;
  }>;
}

export interface NetworkRepository {
  disconnect: () => Promise<void>;
  getNetworkList: () => Promise<INetwork[]>;
  getNetwork: (networkId: string) => Promise<INetwork>;
  addNetwork: (network: INetwork) => Promise<void>;
  updateNetwork: (network: INetwork) => Promise<void>;
  deleteNetwork: (networkId: string) => Promise<void>;
}

export const networkRepository = (db: IDBDatabase): NetworkRepository => {
  const getAll = getAllItems(db);
  const getOne = getOneItem(db);
  const add = addItem(db);
  const update = updateItem(db);
  const deleteOne = deleteItem(db);

  return {
    disconnect: async (): Promise<void> => {
      db.close();
    },
    getNetworkList: async (): Promise<INetwork[]> => {
      return getAll('network');
    },
    getNetwork: async (uuid: string): Promise<INetwork> => {
      return getOne('network', uuid);
    },
    addNetwork: async (network: INetwork): Promise<void> => {
      await add('network', {
        ...network,
        name: network.name ?? network.networkId,
      });
    },
    updateNetwork: async (network: INetwork): Promise<void> => {
      await update('network', network);
    },
    deleteNetwork: async (networkId: string): Promise<void> => {
      await deleteOne('network', networkId);
    },
  };
};

export const addDefaultNetworks = async (db: IDBDatabase) => {
  const repo = networkRepository(db);
  const networks = await repo.getNetworkList();

  if (!networks.find((network) => network.networkId === 'mainnet01')) {
    await repo.addNetwork({
      uuid: crypto.randomUUID(),
      networkId: 'mainnet01',
      name: 'Mainnet',
      hosts: [
        {
          url: 'https://api.chainweb.com',
          submit: true,
          read: true,
          confirm: true,
        },
      ],
    });
  }
  if (!networks.find((network) => network.networkId === 'testnet04')) {
    await repo.addNetwork({
      uuid: crypto.randomUUID(),
      networkId: 'testnet04',
      name: 'Testnet',
      hosts: [
        {
          url: 'https://api.testnet.chainweb.com',
          submit: true,
          read: true,
          confirm: true,
        },
      ],
    });
  }
};

export const createNetworkRepository = async () => {
  const db = await createDatabaseConnection();
  return networkRepository(db);
};
