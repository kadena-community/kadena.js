import React from 'react';
import '../assets/base.css';
import '../assets/chart.css';
import '../assets/banner.css';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import App from 'next/app';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { NetworkContext, useNetworkState } from '../services/app';
import { NetworkName } from '../utils/api';
import { getNetworkCookie, setCookieStatic } from '../utils/cookie';

function MyApp({ Component, pageProps }: AppProps & { Component: any }) {
  const networkState = useNetworkState(
    pageProps?.network || NetworkName.MAIN_NETWORK,
  );
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="user-scalable=no, width=device-width, initial-scale=1.0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>Kadena Block Explorer</title>
      </Head>
      <ErrorBoundary {...pageProps}>
        <NetworkContext.Provider value={networkState}>
          <Component {...pageProps} />
        </NetworkContext.Provider>
      </ErrorBoundary>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const network = await getNetworkCookie(
    appContext.ctx as any,
    appContext.router.asPath,
  );
  setCookieStatic(appContext.ctx as any, 'network', network);
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      network,
    },
  };
};

export default MyApp;
