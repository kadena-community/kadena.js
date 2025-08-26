// load global styles from @kadena/kode-ui
import '@kadena/kode-ui/global';

import { Layout } from '@/components/Common';
import { AppContextProvider, LayoutContextProvider } from '@/context';
import { WalletConnectClientContextProvider } from '@/context/connect-wallet-context';
import '@/resources/styles/globals.css';
import { RouterProvider, Version } from '@kadena/kode-ui';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export interface IPageProps {
  useFullPageWidth?: boolean;
}

const App: FC<AppProps<IPageProps>> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps<IPageProps>) => {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Version
        sha={process.env.NEXT_PUBLIC_COMMIT_SHA}
        SSRTime={process.env.NEXT_PUBLIC_BUILD_TIME}
        repo={`https://github.com/kadena-community/kadena.js/tree/${process.env.NEXT_PUBLIC_COMMIT_SHA || 'main'}/packages/apps/tools`}
      />
      <ThemeProvider
        attribute="class"
        value={{
          light: 'light',
          dark: darkThemeClass,
        }}
      >
        <RouterProvider navigate={router.push}>
          <WalletConnectClientContextProvider>
            <AppContextProvider>
              <LayoutContextProvider>
                <Layout useFullWidth={pageProps.useFullPageWidth}>
                  <ReCaptchaProvider
                    reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_SITEKEY}
                  >
                    <Component {...pageProps} />
                  </ReCaptchaProvider>
                </Layout>
              </LayoutContextProvider>
            </AppContextProvider>
          </WalletConnectClientContextProvider>
        </RouterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
