import {
  AccountInfo,
  Adapter,
  AdapterFactory,
  AdapterFactoryData,
  NetworkInfo,
  WalletAdapterClient,
} from '@kadena/wallet-adapter-core';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * @public
 */
export interface KadenaWalletState {
  loading: boolean;
  accounts: AccountInfo[];
  activeAccount: AccountInfo | null;
  networks: NetworkInfo[];
  activeNetwork: NetworkInfo | null;
}

interface KadenaWalletContextValue {
  client: WalletAdapterClient;
  currentAdapterName: string | null;
  setCurrentAdapterName: (name: string | null) => void;
  providerData: AdapterFactoryData[];
  adapters: Adapter[];
  /** Only populated if using the useKadenaWalletStore hook */
  state: KadenaWalletState;
  setState: (state: Partial<KadenaWalletState>) => void;
}

const KadenaWalletContext = createContext<KadenaWalletContextValue | null>(
  null,
);

/**
 * @public
 */
export interface KadenaWalletProviderProps {
  children: ReactNode;
  adapters: (Adapter | AdapterFactory)[];
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
}: KadenaWalletProviderProps) {
  const [currentAdapterName, setCurrentAdapterName] = useState<string | null>(
    defaultAdapterName ?? null,
  );

  const client = useMemo(
    () => new WalletAdapterClient(inputAdapters),
    [inputAdapters],
  );

  // TODO: change to set
  const [providerData, setProviderData] = useState<AdapterFactoryData[]>(
    client.getProviders(),
  );

  const [state, setState] = useState<KadenaWalletContextValue['state']>({
    loading: false,
    accounts: [],
    activeAccount: null,
    networks: [],
    activeNetwork: null,
  });

  const setPartialState = useCallback(
    (partialState: Partial<KadenaWalletState>) => {
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

    client.init().then(() => {
      setProviderData([...client.getProviders()]);
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
      }) as KadenaWalletContextValue,
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
