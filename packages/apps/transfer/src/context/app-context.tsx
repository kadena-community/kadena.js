import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

export type Network = 'Mainnet' | 'Testnet';

interface INetworkState {
  network: Network;
  setNetwork(network: Network): void;
}

const AppContext = createContext<INetworkState>({
  network: 'Mainnet',
  setNetwork: () => {},
});

const useAppContext = (): INetworkState => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('Please use AppContextProvider in parent component');
  }

  return context;
};

const AppContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [network, setNetwork] = useState<Network>('Mainnet');

  return (
    <AppContext.Provider value={{ network, setNetwork }}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider, useAppContext };
