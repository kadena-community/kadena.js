// load global styles from @kadena/react-ui
import '@kadena/react-ui/global';

import { MediaContextProvider } from '@/components/layout/media';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { RouterProvider } from '@kadena/react-ui';
import { createClient } from 'graphql-ws';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ComponentType } from 'react';
import React from 'react';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const httpLink = new YogaLink({
  endpoint: '/graph',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
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

// eslint-disable-next-line @typescript-eslint/naming-convention, react/function-component-definition
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  const router = useRouter();
  return (
    <ApolloProvider client={client}>
      <RouterProvider navigate={router.push}>
        <MediaContextProvider>
          <Head>
            <title>K:Explorer</title>
            <link
              rel="icon"
              href="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/icons/internal/default/icon%40128.png"
            />
          </Head>

          <main>
            <ReactComponent {...pageProps} />
          </main>
        </MediaContextProvider>
      </RouterProvider>
    </ApolloProvider>
  );
}
