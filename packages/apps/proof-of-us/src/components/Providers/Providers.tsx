'use client';
import { localStorageProvider } from '@/utils/localStorageProvider';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { useContext, useRef, type FC, type PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AccountProvider } from '../AccountProvider/AccountProvider';
import { ProofOfUsProvider } from '../ProofOfUsProvider/ProofOfUsProvider';
import { ToastProvider } from '../ToastProvider/ToastProvider';

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
    <AnimatePresence>
      <SWRConfig value={{ provider: localStorageProvider }}>
        <ApolloProvider client={client}>
          <ToastProvider>
            <AccountProvider>
              <ProofOfUsProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </ProofOfUsProvider>
            </AccountProvider>
          </ToastProvider>
        </ApolloProvider>
      </SWRConfig>
    </AnimatePresence>
  );
};
