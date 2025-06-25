'use client';
import type { INetwork } from '@/contexts/NetworkContext/NetworkContext';
import {
  defaultNetworkContext,
  NetworkContext,
} from '@/contexts/NetworkContext/NetworkContext';
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
import { createClient } from 'graphql-ws';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const cache = new InMemoryCache({
  resultCaching: true,
});

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

export const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeNetwork, _] = useState<INetwork>(
    defaultNetworkContext.activeNetwork,
  );
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
      value={{ activeNetwork, networks: defaultNetworkContext.networks }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};
