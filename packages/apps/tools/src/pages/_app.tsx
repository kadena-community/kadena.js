// load global styles from @kadena/react-ui
import '@kadena/react-ui/global';

import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import { WalletConnectClientContextProvider } from '@/context/connect-wallet-context';
import '@/resources/styles/globals.css';
import { KodeMono } from '@kadena/fonts';
import { RouterProvider } from '@kadena/react-ui';
import { darkThemeClass } from '@kadena/react-ui/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

KodeMono();

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        value={{
          light: 'light',
          dark: darkThemeClass,
        }}
      >
        <RouterProvider navigate={router.push}>
          <WalletConnectClientContextProvider>
            <AppContextProvider>
              <LayoutContextProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </LayoutContextProvider>
            </AppContextProvider>
          </WalletConnectClientContextProvider>
        </RouterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
