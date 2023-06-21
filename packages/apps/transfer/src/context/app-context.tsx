import { getItem, setItem } from '@/utils/persist';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

export type Network = 'Mainnet' | 'Testnet';

interface NetworkState {
  network: Network;
  setNetwork(network: Network): void;
}

const AppContext = createContext<NetworkState>({
  network: 'Mainnet',
  setNetwork: () => {},
});

const useAppContext = (): NetworkState => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Please use AppContextProvider in parent component');
  }

  return context;
};

const AppContextProvider = (props: PropsWithChildren) => {
  const [network, setNetwork] = useState<Network>();

  useLayoutEffect(() => {
    const initialNetwork = getItem('network');
    if (initialNetwork) setNetwork(getItem('network'));
  }, []);

  useEffect(() => {
    setItem('network', network);
  }, [network]);

  return (
    <AppContext.Provider value={{ network, setNetwork }}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider, useAppContext };
