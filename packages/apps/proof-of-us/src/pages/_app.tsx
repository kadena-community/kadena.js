// load global styles from @kadena/react-ui
import '@kadena/react-ui/global';

// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@/components/Analytics/Analytics';
import { Providers } from '@/components/Providers/Providers';
import { Toasts } from '@/components/Toasts/Toasts';
import Head from 'next/head';

import type { AppProps } from 'next/app';

import { Header } from '@/components/Header/Header';
import { mainWrapperClass } from '@/styles/global.css';
import { AnimatePresence } from 'framer-motion';
import type { FC } from 'react';
import React from 'react';

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
  router,
}: AppProps & {
  Component: FC;
}): JSX.Element => {
  return (
    <Providers>
      <>
        <Head>
          <title>Proof Of Us (Powered by Kadena)</title>
          <meta name="title" content="Proof Of Us (Powered by Kadena)" />
          <meta name="description" content="Share your moments" />
          <meta content="text/html; charset=UTF-8" name="Content-Type" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="" />
          <meta
            name="twitter:title"
            content="Proof Of Us (Powered by Kadena)"
          />
          <meta name="twitter:description" content="Share your moments" />
          <meta
            name="twitter:image"
            content={`${process.env.NEXT_PUBLIC_URL}/assets/test.jpg`}
          />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
          <meta property="og:title" content="Proof Of Us (Powered by Kadena)" />
          <meta property="og:description" content="Share your moments" />
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_URL}/assets/test.jpg`}
          />

          <link rel="icon" href="/assets/favicons/icon@32.png" sizes="32x32" />
          <link
            rel="icon"
            href="/assets/favicons/icon@128.png"
            sizes="128x128"
          />
          <link
            rel="shortcut icon"
            sizes="192x192"
            href="/assets/favicons/icon@192.png"
          />
          {/* Android Shortcut icon */}
          <link rel="shortcut icon" href="/assets/favicons/icon@192.png" />
          {/* Apple touch icon */}
          <link rel="apple-touch-icon" href="/assets/favicons/icon@192.png" />
        </Head>
        <Header />
        <main className={mainWrapperClass}>
          <AnimatePresence mode="popLayout" initial={false}>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
          <Toasts />
        </main>
        <Analytics />
      </>
    </Providers>
  );
};

export default MyApp;
