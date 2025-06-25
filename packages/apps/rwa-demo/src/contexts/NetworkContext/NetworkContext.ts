import { env } from '@/utils/env';
import type { ChainId } from '@kadena/client';
import { createContext } from 'react';

export interface INetwork {
  name: string;
  networkId: string;
  host: string;
  chainId: ChainId;
  graphUrl: string;
}

export interface INetworkContext {
  activeNetwork: INetwork;
  networks: INetwork[];
}

export const defaultNetworkContext: INetworkContext = {
  activeNetwork: {
    name: env.NETWORKNAME,
    networkId: env.NETWORKID,
    host: env.NETWORKHOST,
    chainId: env.CHAINID,
    graphUrl: env.GRAPHURL,
  },
  networks: [
    {
      networkId: 'testnet05',
      name: 'Testnet(Pact5)',
      host: 'https://api.testnet05.chainweb.com',
      chainId: '0',
      graphUrl: 'https://graph.testnet05.kadena.network/graphql',
    },
    {
      networkId: 'testnet04',
      name: 'Testnet',
      host: 'https://api.testnet.chainweb.com',
      graphUrl: 'https://graph.testnet.kadena.network/graphql',
      chainId: '0',
    },
    {
      networkId: 'development',
      name: 'development',
      host: 'https://localhost:8080',
      graphUrl: 'http://localhost:8080/graphql',
      chainId: '0',
    },
  ],
};

export const NetworkContext = createContext<INetworkContext | null>(null);
