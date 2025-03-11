'use client';
import { checkNetwork } from '@/utils/checkNetwork';
import { env } from '@/utils/env';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import type { ChainId } from '@kadena/client';
import { createClient } from 'graphql-ws';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';
// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const cache = new InMemoryCache({
  resultCaching: true,
});

export interface INetwork {
  name: string;
  networkId: string;
  host: string;
  chainId: ChainId;
  graphUrl: string;
}

export interface INetworkContext {
  activeNetwork: INetwork;
  networks: INetwork[];
}

const defaultContext: INetworkContext = {
  activeNetwork: {
    name: env.NETWORKNAME,
    networkId: env.NETWORKID,
    host: env.NETWORKHOST,
    chainId: env.CHAINID,
    graphUrl: env.GRAPHURL,
  },
  networks: [
    {
      networkId: 'testnet05',
      name: 'Testnet(Pact5)',
      host: 'https://api.testnet05.chainweb.com',
      chainId: '0',
      graphUrl: 'https://graph.testnet05.kadena.network/graphql',
    },
    {
      networkId: 'testnet04',
      name: 'Testnet',
      host: 'https://api.testnet.chainweb.com',
      graphUrl: 'https://graph.testnet.kadena.network/graphql',
      chainId: '0',
    },
    {
      networkId: 'development',
      name: 'development',
      host: 'https://localhost:8080',
      graphUrl: 'http://localhost:8080/graphql',
      chainId: '0',
    },
  ],
};

const getApolloClient = (network: INetwork) => {
  const httpLink = new YogaLink({
    endpoint: network?.graphUrl,
    headers: {
      'x-api-key': env.GRAPHAPIKEY,
      'bypass-tunnel-reminder': env.GRAPHURL,
    },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: network!.graphUrl,
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
    assumeImmutableResults: true,
    connectToDevTools: true,
    defaultOptions: {
      query: { errorPolicy: 'all' },
    },
  });

  return client;
};

export const NetworkContext = createContext<INetworkContext>(defaultContext);

export const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeNetwork, _] = useState<INetwork>(defaultContext.activeNetwork);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const stopServer = () => {
    client?.stop();
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
    if (!activeNetwork) return;
    const resultClient = getApolloClient(activeNetwork);
    setClient(resultClient);
  }, [activeNetwork]);

  useEffect(() => {
    if (!activeNetwork || !activeNetwork.graphUrl) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkIfNetworkAvailable(activeNetwork.graphUrl);
  }, [activeNetwork]);

  if (!client) return null;
  return (
    <NetworkContext.Provider
      value={{ activeNetwork, networks: defaultContext.networks }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};
