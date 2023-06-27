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

  useLayoutEffect(() => {
    const initialNetwork: string = getItem('network');
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
