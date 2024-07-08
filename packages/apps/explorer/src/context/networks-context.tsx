import { useRouter } from '@/components/routing/useRouter';
import { networkConstants } from '@/constants/network';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

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
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const networkId = router.query.networkId as string;
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>();

  const checkStorage = () => {
    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    setNetworks([...getDefaultNetworks(), ...storage]);
    setIsMounted(true);
  };

  const storageListener = useCallback((event: StorageEvent | Event) => {
    if (event.type !== storageKey && 'key' in event && event.key !== storageKey)
      return;

    checkStorage();
  }, []);

  useEffect(() => {
    if (!networks.length || !isMounted) return;
    const network =
      networks.find((n) => n.networkId === networkId) ?? networks[0];
    console.log(network, networkId);
    setActiveNetwork(network);
  }, [networkId, networks, isMounted]);

  useEffect(() => {
    checkStorage();
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [storageListener]);

  const setActiveNetworkByKey = (networkId: string): void => {
    setActiveNetwork(networks.find((x) => x.networkId === networkId)!);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(`/${networkId}`);
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/${newNetwork.networkId}`);
    }
  };

  const getApolloClient = () => {
    const httpLink = new YogaLink({
      endpoint: activeNetwork?.graphUrl,
    });

    const wsLink = new GraphQLWsLink(
      createClient({
        url: activeNetwork!.wsGraphUrl,
      }),
    );

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink, // Use WebSocket link for subscriptions
      httpLink, // Use HTTP link for queries and mutations
    );

    const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });

    return client;
  };

  if (!isMounted || !activeNetwork) return <div>loading</div>;

  return (
    <NetworkContext.Provider
      value={{
        networks,
        activeNetwork,
        setActiveNetwork: setActiveNetworkByKey,
        addNetwork,
      }}
    >
      <ApolloProvider client={getApolloClient()}>
        {props.children}
      </ApolloProvider>
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider, useNetwork };
