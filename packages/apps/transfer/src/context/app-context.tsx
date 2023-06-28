import { Network } from '@/constants/kadena';
import { getItem, setItem } from '@/utils/persist';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

interface INetworkState {
  network: Network;
  setNetwork(network: Network): void;
}

const AppContext = createContext<INetworkState>({
  network: 'MAINNET',
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
  const [network, setNetwork] = useState<Network>('MAINNET');

  useLayoutEffect(() => {
    const initialNetwork = getItem('network') as Network;
    if (initialNetwork) setNetwork(getItem('network') as Network);
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
