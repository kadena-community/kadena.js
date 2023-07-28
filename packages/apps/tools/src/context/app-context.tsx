import { ChainwebChainId } from '@kadena/chainweb-node-client';

import { DevOption, Network } from '@/constants/kadena';
import { useDidUpdateEffect } from '@/hooks';
import { getItem, setItem } from '@/utils/persist';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

interface INetworkState {
  network: Network;
  setNetwork(network: Network): void;
  chainID: ChainwebChainId;
  setChainID(chainID: ChainwebChainId): void;
  devOption: DevOption;
  setDevOption(option: DevOption): void;
}

const AppContext = createContext<INetworkState>({
  network: 'MAINNET',
  setNetwork: () => {},
  chainID: '1',
  setChainID: () => {},
  devOption: 'BASIC',
  setDevOption: () => {},
});

const StorageKeys: Record<'NETWORK' | 'CHAIN_ID' | 'DEV_OPTION', string> = {
  NETWORK: 'network',
  CHAIN_ID: 'chainID',
  DEV_OPTION: 'devOption',
};

const useAppContext = (): INetworkState => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('Please use AppContextProvider in parent component');
  }

  return context;
};

const AppContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [network, setNetwork] = useState<Network>('MAINNET');
  const [chainID, setChainID] = useState<ChainwebChainId>('1');
  const [devOption, setDevOption] = useState<DevOption>('BASIC');

  useLayoutEffect(() => {
    const initialNetwork = getItem(StorageKeys.NETWORK) as Network;
    if (initialNetwork) {
      setNetwork(initialNetwork);
    }

    const initialChainID = getItem(StorageKeys.CHAIN_ID) as ChainwebChainId;
    if (initialChainID) {
      setChainID(initialChainID);
    }

    const initialDevOption = getItem(StorageKeys.DEV_OPTION) as DevOption;
    if (initialDevOption) {
      setDevOption(initialDevOption);
    }
  }, []);

  useDidUpdateEffect(() => {
    setItem(StorageKeys.NETWORK, network);
    setItem(StorageKeys.CHAIN_ID, chainID);
    setItem(StorageKeys.DEV_OPTION, devOption);
  }, [network, chainID]);

  return (
    <AppContext.Provider
      value={{
        network,
        setNetwork,
        chainID,
        setChainID,
        devOption,
        setDevOption,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider, useAppContext };
