// load global styles from @kadena/kode-ui
import '@kadena/kode-ui/global';

import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import { WalletConnectClientContextProvider } from '@/context/connect-wallet-context';
import '@/resources/styles/globals.css';
import { RouterProvider } from '@kadena/kode-ui';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export interface IPageProps {
  useFullPageWidth?: boolean;
}

const App: FC<AppProps<IPageProps>> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps<IPageProps>) => {
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
                <Layout useFullWidth={pageProps.useFullPageWidth}>
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
