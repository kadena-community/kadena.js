import type { INetworkData } from '@/utils/network';
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
import React, { createContext, useEffect, useState } from 'react';
import { useWalletConnectClient } from './connect-wallet-context';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const cache = new InMemoryCache({
  resultCaching: true,
});

interface INetworkContext {}

const NetworkContext = createContext<INetworkContext>({});

const getApolloClient = (network: INetworkData) => {
  console.log({ network });
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
    assumeImmutableResults: true,
    connectToDevTools: true,
    defaultOptions: {
      query: { errorPolicy: 'all' },
    },
  });

  return client;
};

const NetworkContextProvider: FC<PropsWithChildren> = (props): JSX.Element => {
  const { selectedNetwork: networkId, networksData } = useWalletConnectClient();
  const selectedNetwork = networksData.find(
    (item) => item.networkId === networkId,
  );

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const stopServer = () => {
    client?.stop();
  };

  useEffect(() => {
    if (!selectedNetwork) return;
    const resultClient = getApolloClient(selectedNetwork);
    setClient(resultClient);
  }, [selectedNetwork]);

  if (!client) return <></>;

  return (
    <NetworkContext.Provider value={{}}>
      <ApolloProvider client={client}>{props.children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider };
