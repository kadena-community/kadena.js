import { useRouter } from '@/components/routing/useRouter';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import type { INetwork } from '@/constants/network';
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
import Cookies from 'js-cookie';
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

const cache = new InMemoryCache({
  resultCaching: true,
});

interface INetworkContext {
  networks: INetwork[];
  activeNetwork: INetwork;
  setActiveNetwork: (activeNetwork: INetwork['slug']) => void;
  addNetwork: (newNetwork: INetwork) => void;
  removeNetwork: (newNetwork: INetwork) => void;
}

const NetworkContext = createContext<INetworkContext>({
  networks: [],
  activeNetwork: {} as INetwork,
  setActiveNetwork: () => {},
  addNetwork: () => {},
  removeNetwork: () => {},
});

export const storageKey = 'networks';
export const selectedNetworkKey = 'selectedNetwork';

const useNetwork = (): INetworkContext => {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error('Please use networkContextProvider in parent component');
  }

  return context;
};

export const getDefaultNetworks = (): INetworkContext['networks'] =>
  networkConstants;

export const getNetworks = (): INetwork[] => {
  const storage: INetwork[] = JSON.parse(
    localStorage.getItem(storageKey) ?? '[]',
  );

  return [...getDefaultNetworks(), ...storage];
};

const NetworkContextProvider = (props: {
  networks?: INetwork[];
  children: React.ReactNode;
}): JSX.Element => {
  const [networks, setNetworks] = useState<INetwork[]>(getDefaultNetworks());
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const networkSlug = router.query.networkSlug as string;
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>();
  const { addToast } = useToast();

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
    const network = networks.find((n) => n.slug && n.slug === networkSlug);
    setActiveNetwork(network);
  }, [networkSlug, networks, isMounted]);

  useEffect(() => {
    checkStorage();
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [storageListener]);

  const setActiveNetworkByKey = (networkSlug: string): void => {
    const network = networks.find((x) => x.slug === networkSlug);

    if (!network) {
      addToast({
        type: 'negative',
        label: 'Network not found',
        body: `network ${networkSlug} is deprecated`,
      });
      return;
    }

    localStorage.setItem(selectedNetworkKey, JSON.stringify(network));
    Cookies.set(selectedNetworkKey, network.slug);

    window.location.href = `/${networkSlug}`;
  };

  const removeNetwork = (network: INetwork): void => {
    const defaultNetworks = getDefaultNetworks();

    //if a defaultnetwork dont delete
    if (
      defaultNetworks.find(
        (nw) => nw.slug === network.slug && nw.label === network.label,
      )
    )
      return;

    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );
  };

  const addNetwork = (newNetwork: INetwork): void => {
    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    if (!storage.find((network) => network.slug === newNetwork.slug)) {
      storage.push(newNetwork);
      localStorage.setItem(storageKey, JSON.stringify(storage));
      window.dispatchEvent(new Event(storageKey));

      setActiveNetwork(newNetwork);
      localStorage.setItem(selectedNetworkKey, JSON.stringify(newNetwork));
      Cookies.set(selectedNetworkKey, newNetwork.slug);

      window.location.href = `/${newNetwork.slug}`;
    }
  };

  const getApolloClient = useCallback(() => {
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
      cache,
    });

    return client;
  }, [activeNetwork]);

  useEffect(() => {
    if (!isMounted && router.asPath === '/' && !activeNetwork) {
      setActiveNetwork(networks[0]);
    }
  }, [isMounted, activeNetwork]);

  if (!isMounted || !activeNetwork) return <></>;

  return (
    <NetworkContext.Provider
      value={{
        networks,
        activeNetwork,
        setActiveNetwork: setActiveNetworkByKey,
        addNetwork,
        removeNetwork,
      }}
    >
      <ApolloProvider client={getApolloClient()}>
        {props.children}
      </ApolloProvider>
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider, useNetwork };
