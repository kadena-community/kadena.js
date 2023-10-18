import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import { WalletConnectClientContextProvider } from '@/context/connect-wallet-context';
import '@/resources/styles/globals.css';
import { ModalProvider } from '@kadena/react-ui';
import { darkThemeClass } from '@kadena/react-ui/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import type { FC } from 'react';
import React from 'react';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
    >
      <WalletConnectClientContextProvider>
        <AppContextProvider>
          <LayoutContextProvider>
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </LayoutContextProvider>
        </AppContextProvider>
      </WalletConnectClientContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
