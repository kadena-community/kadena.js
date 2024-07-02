import { networkConstants } from '@/constants/network';
import React, { createContext, useContext, useState } from 'react';

export type INetwork = Omit<
  typeof networkConstants.mainnet01,
  'chainwebUrl' | 'explorerUrl'
> & {
  chainwebUrl?: string;
  explorerUrl?: string;
};

interface INetworkContext {
  networks: INetwork[];
  activeNetwork: INetwork;
  setActiveNetwork: (activeNetwork: INetwork['networkId']) => void;
  addNetwork: (newNetwork: INetwork) => void;
}

const NetworkContext = createContext<INetworkContext>({
  networks: [],
  activeNetwork: {} as INetwork,
  setActiveNetwork: () => {},
  addNetwork: () => {},
});

const useNetworkContext = (): INetworkContext => {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error('Please use networkContextProvider in parent component');
  }

  return context;
};

const NetworkContextProvider = (props: {
  networks?: INetwork[];
  children: React.ReactNode;
}): JSX.Element => {
  const [networks, setNetworks] = useState<INetworkContext['networks']>([
    networkConstants.mainnet01,
    networkConstants.testnet04,
  ]);

  let [activeNetwork, setActiveNetwork] = useState<INetwork>(
    networks.find((x) => x.networkId === 'mainnet01')!,
  );

  const setActiveNetworkByKey = (networkId: string): void => {
    setActiveNetwork(networks.find((x) => x.networkId === networkId)!);

    // switch url when switching between mainnet01 and testnet04
    switch (networkId) {
      case 'mainnet01':
        window.location.assign('https://explorer.kadena.io/');
        break;
      case 'testnet04':
        window.location.assign('https://explorer.testnet.kadena.io/');
        break;
      default:
        break;
    }
  };

  const addNetwork = (newNetwork: INetwork): void => {
    setNetworks((networks) => [...networks, newNetwork]);
  };

  return (
    <NetworkContext.Provider
      value={{
        networks,
        activeNetwork,
        setActiveNetwork: setActiveNetworkByKey,
        addNetwork,
      }}
    >
      {props.children}
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider, useNetworkContext };
