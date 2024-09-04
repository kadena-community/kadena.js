'use client';
import { localStorageProvider } from '@/utils/localStorageProvider';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AccountProvider } from '../AccountProvider/AccountProvider';
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
        <AccountProvider>
          <TokenProvider>
            <ThemeProvider
              attribute="class"
              value={{
                light: 'light',
                dark: darkThemeClass,
              }}
            >
              {children}
            </ThemeProvider>
          </TokenProvider>
        </AccountProvider>
      </ApolloProvider>
    </SWRConfig>
  );
};
