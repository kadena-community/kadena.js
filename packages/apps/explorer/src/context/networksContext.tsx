import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import type { INetwork } from '@/constants/network';
import { networkConstants } from '@/constants/network';
import { useRouter } from '@/hooks/router';
import { checkNetwork } from '@/utils/checkNetwork';
import { isDefaultNetwork } from '@/utils/isDefaultNetwork';
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
  stopServer: () => void;
}

const NetworkContext = createContext<INetworkContext>({
  networks: [],
  activeNetwork: {} as INetwork,
  setActiveNetwork: () => {},
  addNetwork: () => {},
  removeNetwork: () => {},
  stopServer: () => {},
});

export const storageKey = 'networks';
export const selectedNetworkKey = 'selectedNetwork';

const getApolloClient = (network: INetwork) => {
  const httpLink = new YogaLink({
    endpoint: network?.graphUrl,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: network!.wsGraphUrl,
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
};

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
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const { addNetworkFailToast } = useToast();

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

  const stopServer = () => {
    client?.stop();
    addNetworkFailToast({
      body: `There is an issue with ${activeNetwork!.graphUrl}`,
    });
  };

  const checkIfNetworkAvailable = async (graphUrl: string) => {
    try {
      const result = await checkNetwork(graphUrl);
      await result.json();

      if (result.status !== 200) {
        stopServer();
      }
    } catch (e) {
      stopServer();
    }
  };

  useEffect(() => {
    if (!activeNetwork || !activeNetwork.graphUrl) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkIfNetworkAvailable(activeNetwork.graphUrl);
  }, [activeNetwork]);

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

  useEffect(() => {
    if (!activeNetwork) return;
    const resultClient = getApolloClient(activeNetwork);
    setClient(resultClient);
  }, [activeNetwork]);

  const setActiveNetworkByKey = (networkSlug: string): void => {
    const network = networks.find((x) => x.slug === networkSlug);

    if (!network) {
      stopServer();
      return;
    }

    localStorage.setItem(selectedNetworkKey, JSON.stringify(network));
    Cookies.set(selectedNetworkKey, network.slug);

    window.location.href = `/${networkSlug}`;
  };

  const removeNetwork = (paramNetwork: INetwork): void => {
    //if a defaultnetwork dont delete
    if (isDefaultNetwork(paramNetwork)) return;

    const storage: INetwork[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    const newStorage = storage.filter((n) => n.slug !== paramNetwork.slug);
    localStorage.setItem(storageKey, JSON.stringify(newStorage));
    window.dispatchEvent(new Event(storageKey));

    //if the removed network was the active network, redirect to mainnet
    if (activeNetwork?.slug === paramNetwork.slug) {
      localStorage.removeItem(selectedNetworkKey);
      Cookies.remove(selectedNetworkKey);

      window.location.href = `/mainnet`;
    }
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

  useEffect(() => {
    if (!isMounted && router.asPath === '/' && !activeNetwork) {
      setActiveNetwork(networks[0]);
    }
  }, [isMounted, activeNetwork]);

  if (!isMounted || !activeNetwork || !client) return <></>;

  return (
    <NetworkContext.Provider
      value={{
        networks,
        activeNetwork,
        setActiveNetwork: setActiveNetworkByKey,
        addNetwork,
        removeNetwork,
        stopServer,
      }}
    >
      <ApolloProvider client={client}>{props.children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider, useNetwork };
