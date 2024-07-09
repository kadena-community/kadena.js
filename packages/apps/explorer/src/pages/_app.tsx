// load global styles from @kadena/kode-ui
import { MediaContextProvider } from '@/components/layout/media';
import { useRouter } from '@/components/routing/useRouter';
import { NetworkContextProvider } from '@/context/networks-context';
import { QueryContextProvider } from '@/context/query-context';
import '@components/globalstyles.css';
import { RouterProvider, useTheme } from '@kadena/kode-ui';
import '@kadena/kode-ui/global';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ComponentType } from 'react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention, react/function-component-definition
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  const router = useRouter();
  useTheme();

  return (
    <NetworkContextProvider>
      <RouterProvider navigate={router.push}>
        <MediaContextProvider>
          <QueryContextProvider>
            <Head>
              <title>K:Explorer</title>
              <link
                rel="icon"
                href="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/icons/internal/default/icon%40128.png"
              />
            </Head>

            <main>
              <ReactComponent {...pageProps} />
            </main>
          </QueryContextProvider>
        </MediaContextProvider>
      </RouterProvider>
    </NetworkContextProvider>
  );
}
