import { execInSequence } from '@/utils/helpers';
import { IDBService, dbService } from '../db/db.service';
import { UUID } from '../types';

export interface INetwork {
  uuid: UUID;
  networkId: string;
  name?: string;
  default?: boolean;
  disabled?: boolean;
  removed?: boolean;
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
  getAllNetworks: (includingDeleted?: boolean) => Promise<INetwork[]>;
  getNetwork: (uuid: UUID) => Promise<INetwork>;
  getNetworkByNetworkId: (uuid: string) => Promise<INetwork>;
  addNetwork: (network: INetwork) => Promise<INetwork>;
  updateNetwork: (network: INetwork) => Promise<void>;
  deleteNetwork: (uuid: UUID) => Promise<void>;
}

const createNetworkRepository = ({
  getAll,
  getOne,
  add,
  update,
}: IDBService): NetworkRepository => {
  const networkRepository: NetworkRepository = {
    getEnabledNetworkList: async (): Promise<INetwork[]> => {
      const list: INetwork[] = await getAll('network');
      console.log('getEnabledNetworkList', list);
      return list.filter((network) => !network.disabled);
    },

    getAllNetworks: async (includingDeleted = false): Promise<INetwork[]> => {
      const list: INetwork[] = await getAll('network');
      return includingDeleted
        ? list
        : list.filter((network) => !network.removed);
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
    addNetwork: async (network: INetwork): Promise<INetwork> => {
      const existingNetwork = await networkRepository.getNetworkByNetworkId(
        network.networkId,
      );
      // if the network already exists and it is removed, we keep the uuid and update the network;
      // this is to keep the relation with other models
      if (existingNetwork && existingNetwork.removed) {
        const updatedNetwork = {
          ...network,
          name: network.name ?? network.networkId,
          uuid: existingNetwork.uuid,
        };
        await update('network', updatedNetwork);
        return updatedNetwork;
      }
      const newNetwork = {
        ...network,
        name: network.name ?? network.networkId,
      };
      await add('network', newNetwork);
      return newNetwork;
    },
    updateNetwork: async (network: INetwork): Promise<void> => {
      await update('network', network);
    },
    // many models have relation to the network model, so we don't delete the network to avoid breaking the relation
    // we just mark it as disabled and removed then we don't show it in the UI
    deleteNetwork: async (uuid: UUID): Promise<void> => {
      const network = await getOne<INetwork>('network', uuid);
      if (network) {
        await update('network', {
          ...network,
          disabled: true,
          removed: true,
          default: false,
        });
      }
    },
  };
  return networkRepository;
};
export const networkRepository = createNetworkRepository(dbService);

export const addDefaultNetworks = execInSequence(async () => {
  const networks = await networkRepository.getAllNetworks(true);

  if (!networks.find((network) => network.networkId === 'mainnet01')) {
    await networkRepository.addNetwork({
      uuid: crypto.randomUUID(),
      networkId: 'mainnet01',
      name: 'Mainnet',
      default: true,
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
});
