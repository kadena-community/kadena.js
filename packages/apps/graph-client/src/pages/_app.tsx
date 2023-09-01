import '../styles/globals.css';

import {
  type NormalizedCacheObject,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import type { AppProps } from 'next/app';
import type { ComponentType } from 'react';
import React from 'react';
// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new YogaLink({
    endpoint: '/graph',
  }),
  cache: new InMemoryCache(),
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  return (
    <ApolloProvider client={client}>
      <ReactComponent {...pageProps} />
    </ApolloProvider>
  );
}
