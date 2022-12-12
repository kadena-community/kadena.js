import '../styles/globals.css';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { YogaLink } from '@graphql-yoga/apollo-link';
import type { AppProps } from 'next/app';
import React from 'react';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new YogaLink({
    endpoint: '/graph',
  }),
  cache: new InMemoryCache(),
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
