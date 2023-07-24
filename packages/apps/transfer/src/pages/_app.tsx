import '@/resources/styles/globals.css';

import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import type { AppProps } from 'next/app';
import React, { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <AppContextProvider>
    <LayoutContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LayoutContextProvider>
  </AppContextProvider>
);

export default App;
