import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Kadena Docs</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
