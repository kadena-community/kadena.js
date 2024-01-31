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
  hosts: Array<{
    url: string;
    submit: boolean;
    read: boolean;
    confirmation: boolean;
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
    getNetwork: async (networkId: string): Promise<INetwork> => {
      return getOne('network', networkId);
    },
    addNetwork: async (network: INetwork): Promise<void> => {
      await add('network', network);
    },
    updateNetwork: async (network: INetwork): Promise<void> => {
      await update('network', network);
    },
    deleteNetwork: async (networkId: string): Promise<void> => {
      await deleteOne('network', networkId);
    },
  };
};

export const createNetworkRepository = async () => {
  const db = await createDatabaseConnection();
  return networkRepository(db);
};
