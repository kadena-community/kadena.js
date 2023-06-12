import '@/resources/styles/globals.css';

import { Layout } from '@/components/Common';
import { AppContextProvider } from '@/context/app-context';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { FC, ReactElement, ReactNode } from 'react';
import React from 'react';

// @see; https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: FC<AppPropsWithLayout> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <AppContextProvider>
        <Layout>{page}</Layout>
      </AppContextProvider>
    ));

  return getLayout(<Component {...pageProps} />);
};

export default App;
