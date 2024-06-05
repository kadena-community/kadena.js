import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import { Providers } from '@/providers/Providers';
import Layout from '@/components/Layout';

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
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
    </Providers>
  );
};

export default MyApp;
