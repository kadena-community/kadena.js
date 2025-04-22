import type {
  AdapterFactory,
  IAccountInfo,
  IAdapter,
  IAdapterFactoryData,
  INetworkInfo,
} from '@kadena/wallet-adapter-core';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * @public
 */
export interface IKadenaWalletState {
  loading: boolean;
  accounts: IAccountInfo[];
  activeAccount: IAccountInfo | null;
  networks: INetworkInfo[];
  activeNetwork: INetworkInfo | null;
}

interface IKadenaWalletContextValue {
  client: WalletAdapterClient;
  currentAdapterName: string | null;
  setCurrentAdapterName: (name: string | null) => void;
  providerData: IAdapterFactoryData[];
  adapters: IAdapter[];
  /** Only populated if using the useKadenaWalletStore hook */
  state: IKadenaWalletState;
  setState: (state: Partial<IKadenaWalletState>) => void;
}

const KadenaWalletContext = createContext<IKadenaWalletContextValue | null>(
  null,
);

/**
 * @public
 */
export interface IKadenaWalletProviderProps {
  children: ReactNode;
  adapters: (IAdapter | AdapterFactory)[];
  defaultAdapterName?: string;
}

/**
 * KadenaWalletProvider instantiates a WalletAdapterClient with the provided adapters
 * and manages the current adapter name.
 *
 * @public
 */
export function KadenaWalletProvider({
  children,
  adapters: inputAdapters,
  defaultAdapterName,
}: IKadenaWalletProviderProps) {
  const [currentAdapterName, setCurrentAdapterName] = useState<string | null>(
    defaultAdapterName ?? null,
  );

  const client = useMemo(
    () => new WalletAdapterClient(inputAdapters),
    [inputAdapters],
  );

  // TODO: change to set
  const [providerData, setProviderData] = useState<IAdapterFactoryData[]>(
    client.getProviders(),
  );

  const [state, setState] = useState<IKadenaWalletContextValue['state']>({
    loading: false,
    accounts: [],
    activeAccount: null,
    networks: [],
    activeNetwork: null,
  });

  const setPartialState = useCallback(
    (partialState: Partial<IKadenaWalletState>) => {
      setState((prevState) => ({ ...prevState, ...partialState }));
    },
    [setState],
  );

  useEffect(() => {
    const controller = new AbortController();
    client.onAdapterDetected(
      (adapter) => {
        console.log('adapter detected', adapter);
        setProviderData([...client.getProviders()]);
      },
      { signal: controller.signal },
    );

    client
      .init()
      .then(() => {
        setProviderData([...client.getProviders()]);
      })
      .catch((err) => {
        console.error('Error initializing adapters', err);
      });
    return () => controller.abort();
  }, [client]);

  console.log(
    'active',
    providerData.map(
      (a) => `${a.name} ${a.detected ? 'active' : 'not active'}`,
    ),
  );

  const value = useMemo(
    () =>
      ({
        client,
        providerData,
        currentAdapterName,
        setCurrentAdapterName,
        state,
        setState: setPartialState,
      }) as IKadenaWalletContextValue,
    [
      client,
      providerData,
      setCurrentAdapterName,
      currentAdapterName,
      state,
      setPartialState,
    ],
  );

  return (
    <KadenaWalletContext.Provider value={value}>
      {children}
    </KadenaWalletContext.Provider>
  );
}

/**
 * Hook to access the Kadena Wallet context.
 *
 * @public
 */
export function useKadenaWallet() {
  const ctx = useContext(KadenaWalletContext);
  if (!ctx) {
    throw new Error(
      'useKadenaWallet must be used within a KadenaWalletProvider',
    );
  }
  return ctx;
}
