import { Analytics } from '@/components/Analytics/Analytics';
import Layout from '@/components/Layout';
import { Providers } from '@/providers/Providers';
import type { AppProps } from 'next/app';
import React, { FC } from 'react';

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
  router,
}: AppProps & {
  Component: FC;
}): React.JSX.Element => {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
      <Analytics />
    </Providers>
  );
};

export default MyApp;
