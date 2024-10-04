import { execInSequence } from '@/utils/helpers';
import { IDBService, dbService } from '../db/db.service';

export interface INetwork {
  uuid: string;
  networkId: string;
  name?: string;
  default?: boolean;
  disabled?: boolean;
  hosts: Array<{
    url: string;
    submit: boolean;
    read: boolean;
    confirm: boolean;
  }>;
}

export interface NetworkRepository {
  getEnabledNetworkList: () => Promise<INetwork[]>;
  getAllNetworks: () => Promise<INetwork[]>;
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
    getEnabledNetworkList: async (): Promise<INetwork[]> => {
      const list: INetwork[] = await getAll('network');
      return list.filter((network) => !network.disabled);
    },

    getAllNetworks: async (): Promise<INetwork[]> => {
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

export const addDefaultNetworks = execInSequence(async () => {
  const networks = await networkRepository.getAllNetworks();

  if (!networks.find((network) => network.networkId === 'mainnet01')) {
    await networkRepository.addNetwork({
      uuid: crypto.randomUUID(),
      networkId: 'mainnet01',
      name: 'Mainnet',
      // make mainnet disabled for now
      disabled: true,
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
      default: true,
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
  if (!networks.find((network) => network.networkId === 'testnet05')) {
    await networkRepository.addNetwork({
      uuid: crypto.randomUUID(),
      networkId: 'testnet05',
      name: 'Testnet(Pact5)',
      hosts: [
        {
          url: 'http://api1.testnet05.chainweb.com',
          submit: true,
          read: true,
          confirm: true,
        },
      ],
    });
  }
});
