import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const AnyComponent = Component as any;
  return (
    <>
      <Head>
        <title>Kadena Docs</title>
      </Head>
      <AnyComponent {...pageProps} />
    </>
  );
}
