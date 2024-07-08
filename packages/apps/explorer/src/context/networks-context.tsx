import { networkConstants } from '@/constants/network';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

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

const storageKey = 'networks';

const useNetwork = (): INetworkContext => {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error('Please use networkContextProvider in parent component');
  }

  return context;
};

const getDefaultNetworks = (): INetworkContext['networks'] => [
  networkConstants.mainnet01,
  networkConstants.testnet04,
];

const NetworkContextProvider = (props: {
  networks?: INetwork[];
  children: React.ReactNode;
}): JSX.Element => {
  const [networks, setNetworks] = useState<INetwork[]>(getDefaultNetworks());

  const checkStorage = () => {
    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    setNetworks([...getDefaultNetworks(), ...storage]);
  };

  const storageListener = useCallback((event: StorageEvent | Event) => {
    if (event.type !== storageKey && 'key' in event && event.key !== storageKey)
      return;

    checkStorage();
  }, []);

  useEffect(() => {
    checkStorage();
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [storageListener]);

  const [activeNetwork, setActiveNetwork] = useState<INetwork>(
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
    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );
    if (
      !storage.find((network) => network.networkId === newNetwork.networkId)
    ) {
      storage.push(newNetwork);
      localStorage.setItem(storageKey, JSON.stringify(storage));
      window.dispatchEvent(new Event(storageKey));

      setNetworks((v) => [...v, newNetwork]);
      setActiveNetwork(newNetwork);
    }
  };

  console.log({ networks, activeNetwork });
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

export { NetworkContext, NetworkContextProvider, useNetwork };
