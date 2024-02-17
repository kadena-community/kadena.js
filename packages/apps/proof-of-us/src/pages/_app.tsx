// load global styles from @kadena/react-ui
import '@kadena/react-ui/global';

// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@/components/Analytics/Analytics';

import { Providers } from '@/components/Providers/Providers';
import { Toasts } from '@/components/Toasts/Toasts';

import type { AppProps } from 'next/app';

import { Header } from '@/components/Header/Header';
import { mainWrapperClass } from '@/styles/global.css';
import type { FC } from 'react';
import React from 'react';

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps & {
  Component: FC;
}): JSX.Element => {
  return (
    <>
      <Providers>
        <>
          <Header />
          <main className={mainWrapperClass}>
            <Component {...pageProps} />

            <Toasts />
          </main>
          <Analytics />
        </>
      </Providers>
    </>
  );
};

export default MyApp;
