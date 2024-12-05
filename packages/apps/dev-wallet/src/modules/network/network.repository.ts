import { execInSequence } from '@/utils/helpers';
import { IDBService, dbService } from '../db/db.service';
import { UUID } from '../types';

export interface INetwork {
  uuid: UUID;
  networkId: string;
  name?: string;
  default?: boolean;
  disabled?: boolean;
  faucetContract?: string;
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
  getNetwork: (uuid: UUID) => Promise<INetwork>;
  getNetworkByNetworkId: (uuid: string) => Promise<INetwork>;
  addNetwork: (network: INetwork) => Promise<void>;
  updateNetwork: (network: INetwork) => Promise<void>;
  deleteNetwork: (uuid: UUID) => Promise<void>;
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

    getNetwork: async (uuid: UUID): Promise<INetwork> => {
      return getOne('network', uuid);
    },
    getNetworkByNetworkId: async (networkId: string): Promise<INetwork> => {
      const networks = await getAll<INetwork>(
        'network',
        networkId,
        'networkId',
      );
      return networks[0];
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
    deleteNetwork: async (uuid: UUID): Promise<void> => {
      await remove('network', uuid);
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
      faucetContract: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
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
      faucetContract: 'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet',
      hosts: [
        {
          url: 'https://api.testnet05.chainweb.com',
          submit: true,
          read: true,
          confirm: true,
        },
      ],
    });
  }
});
