'use client';
import { localStorageProvider } from '@/utils/localStorageProvider';

import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AccountProvider } from '../AccountProvider/AccountProvider';
import { ProofOfUsProvider } from '../ProofOfUsProvider/ProofOfUsProvider';
import { ToastProvider } from '../ToastProvider/ToastProvider';
import { TokenProvider } from '../TokenProvider/TokenProvider';

// next/apollo-link bug: https://github.com/dotansimha/graphql-yoga/issues/2194
// eslint-disable-next-line @typescript-eslint/no-var-requires

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <ToastProvider>
        <AccountProvider>
          <ThemeProvider>
            <TokenProvider>
              <ProofOfUsProvider>{children}</ProofOfUsProvider>
            </TokenProvider>
          </ThemeProvider>
        </AccountProvider>
      </ToastProvider>
    </SWRConfig>
  );
};
