import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  return (
    <>
      <Head>
        <title>Kadena Docs</title>
      </Head>
      <ReactComponent {...pageProps} />
    </>
  );
}
