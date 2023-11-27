import Layout from '@/components/Common/Layout';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import '@styles/globals.css';
import type { AppProps } from 'next/app';
import type { ComponentType } from 'react';
import React from 'react';
import { ChainTreeContextProvider } from '../context/chain-tree-context';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new YogaLink({
    endpoint: '/graph',
  }),
  cache: new InMemoryCache(),
});

// eslint-disable-next-line @typescript-eslint/naming-convention, react/function-component-definition
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  const is404 = ReactComponent.name === 'Error' && pageProps.statusCode === 404;

  return (
    <ApolloProvider client={client}>
      <Layout omitHeader={is404}>
        <ChainTreeContextProvider>
          <ReactComponent {...pageProps} />
        </ChainTreeContextProvider>
      </Layout>
    </ApolloProvider>
  );
}
