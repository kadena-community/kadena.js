import { IDBService, dbService } from '../db/db.service';

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
  getNetworkList: () => Promise<INetwork[]>;
  getNetwork: (networkId: string) => Promise<INetwork>;
  addNetwork: (network: INetwork) => Promise<void>;
  updateNetwork: (network: INetwork) => Promise<void>;
  deleteNetwork: (networkId: string) => Promise<void>;
}

const createNetworkRepository = ({
  getAll,
  getOne,
  add,
  update,
  remove,
}: IDBService): NetworkRepository => {
  return {
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
      await remove('network', networkId);
    },
  };
};
export const networkRepository = createNetworkRepository(dbService);

export const addDefaultNetworks = async () => {
  const networks = await networkRepository.getNetworkList();

  if (!networks.find((network) => network.networkId === 'mainnet01')) {
    await networkRepository.addNetwork({
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
    await networkRepository.addNetwork({
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
