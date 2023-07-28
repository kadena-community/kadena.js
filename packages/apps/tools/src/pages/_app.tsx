import '@/resources/styles/globals.css';

import { ModalProvider } from '@kadena/react-ui';
import { darkThemeClass } from '@kadena/react-ui/theme';

import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React, { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider
    attribute="class"
    value={{
      light: 'light',
      dark: darkThemeClass,
    }}
  >
    <AppContextProvider>
      <LayoutContextProvider>
        <ModalProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalProvider>
      </LayoutContextProvider>
    </AppContextProvider>
  </ThemeProvider>
);

export default App;
