// load global styles from @kadena/kode-ui
import '@kadena/kode-ui/global';

// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@/components/Analytics/Analytics';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { Providers } from '@/components/Providers/Providers';
import { mainWrapperClass } from '@/styles/global.css';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
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
          <meta content="text/html; charset=UTF-8" name="Content-Type" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            key="title"
            name="title"
            content="Proof Of Us (Powered by Kadena)"
          />
          <meta
            key="description"
            name="description"
            content="Share your moments"
          />
          {/* <!-- Twitter --> */}
          <meta
            key="twitter:card"
            name="twitter:card"
            content="summary_large_image"
          />
          <meta
            key="twitter:url"
            name="twitter:url"
            content={`${process.env.NEXT_PUBLIC_URL}`}
          />
          <meta
            key="twitter:title"
            name="twitter:title"
            content="Proof Of Us (Powered by Kadena)"
          />
          <meta
            key="twitter:description"
            name="twitter:description"
            content="Share your moments"
          />
          <meta
            key="twitter:image"
            name="twitter:image"
            content={`${process.env.NEXT_PUBLIC_URL}/assets/proof-of-us-logo.png`}
          />
          {/* <!-- Open Graph / Facebook --> */}
          <meta key="og:type" property="og:type" content="website" />
          <meta
            key="og:url"
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_URL}`}
          />
          <meta
            key="og:title"
            property="og:title"
            content="Proof Of Us (Powered by Kadena)"
          />
          <meta
            key="og:description"
            property="og:description"
            content="Share your moments"
          />
          <meta
            key="og:image"
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_URL}/assets/proof-of-us-logo.png`}
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
        <main className={mainWrapperClass}>
          <CookieConsent />
          <AnimatePresence mode="popLayout" initial={false}>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
        </main>
        <Analytics />
      </>
    </Providers>
  );
};

export default MyApp;
