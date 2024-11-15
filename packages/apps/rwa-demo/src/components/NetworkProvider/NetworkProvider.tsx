'use client';
import { env } from '@/utils/env';
import type { ChainId } from '@kadena/client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

export interface INetwork {
  name: string;
  networkId: string;
  host: string;
  chainId: ChainId;
}

export interface INetworkContext {
  activeNetwork: INetwork;
  networks: INetwork[];
}

const defaultContext: INetworkContext = {
  activeNetwork: {
    name: env.NETWORKNAME,
    networkId: env.NETWORKID,
    host: env.NETWORKHOST,
    chainId: env.CHAINID,
  },
  networks: [
    {
      networkId: 'testnet05',
      name: 'Testnet(Pact5)',
      host: 'https://api.testnet05.chainweb.com',
      chainId: '0',
    },
    {
      networkId: 'testnet04',
      name: 'Testnet',
      host: 'https://api.testnet.chainweb.com',
      chainId: '0',
    },
    {
      networkId: 'development',
      name: 'development',
      host: 'https://localhost:8080',
      chainId: '0',
    },
  ],
};

export const NetworkContext = createContext<INetworkContext>(defaultContext);

export const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeNetwork, _] = useState<INetwork>(defaultContext.activeNetwork);

  return (
    <NetworkContext.Provider
      value={{ activeNetwork, networks: defaultContext.networks }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
