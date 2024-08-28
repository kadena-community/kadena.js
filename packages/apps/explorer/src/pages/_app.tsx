// load global styles from @kadena/kode-ui
import { Analytics } from '@/components/Analytics/Analytics';
import { MediaContextProvider } from '@/components/Layout/media';
import { ToastProvider } from '@/components/Toast/ToastContext/ToastContext';
import { NetworkContextProvider } from '@/context/networksContext';
import { QueryContextProvider } from '@/context/queryContext';
import { SearchContextProvider } from '@/context/searchContext';
import { useRouter } from '@/hooks/router';
import { useIphoneInputFix } from '@/hooks/useIphoneInputFix';
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
  useIphoneInputFix();
  return (
    <>
      <Head>
        <title>K:Explorer</title>
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/icons/internal/default/icon%40128.png"
        />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <ToastProvider>
        <NetworkContextProvider>
          <RouterProvider navigate={router.push}>
            <MediaContextProvider>
              <QueryContextProvider>
                <SearchContextProvider>
                  <ReactComponent {...pageProps} />
                </SearchContextProvider>
              </QueryContextProvider>
            </MediaContextProvider>
          </RouterProvider>
        </NetworkContextProvider>
        <Analytics />
      </ToastProvider>
    </>
  );
}
