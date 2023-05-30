import '@/resources/styles/globals.css';

import { Layout } from '@/components/Common';
import type { AppProps } from 'next/app';
import React, { FC } from 'react';

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <Layout>
    {/* @ts-ignore */}
    <Component {...pageProps} />
  </Layout>
);

export default App;
