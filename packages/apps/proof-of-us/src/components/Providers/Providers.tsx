'use client';
import { localStorageProvider } from '@/utils/localStorageProvider';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AccountProvider } from '../AccountProvider/AccountProvider';
import { ToastProvider } from '../ToastProvider/ToastProvider';
import { TokenProvider } from '../TokenProvider/TokenProvider';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { YogaLink } = require('@graphql-yoga/apollo-link');

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: new YogaLink({
    endpoint: '/graph',
  }),
  cache: new InMemoryCache(),
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <ApolloProvider client={client}>
        <ToastProvider>
          <AccountProvider>
            <ThemeProvider>
              <TokenProvider>{children}</TokenProvider>
            </ThemeProvider>
          </AccountProvider>
        </ToastProvider>
      </ApolloProvider>
    </SWRConfig>
  );
};
