import { Analytics } from '@/components/Analytics/Analytics';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { KodeMono } from '@kadena/fonts';
import { ThemeProvider } from 'next-themes';
import type { AppInitialProps } from 'next/app';
import Head from 'next/head';
import type { FC } from 'react';
import React from 'react';

KodeMono();

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppInitialProps & {
  Component: FC;
}): JSX.Element => {
  const ogImage = '';
  const title = 'Proof of Us | Kadena';
  const description = '';
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <!-- Twitter --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />

        <link
          rel="icon"
          href="/assets/favicons/light/icon@32.png"
          sizes="32x32"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/assets/favicons/dark/icon@32.png"
          sizes="32x32"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/assets/favicons/light/icon@128.png"
          sizes="128x128"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/assets/favicons/dark/icon@128.png"
          sizes="128x128"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="shortcut icon"
          sizes="192x192"
          href="/assets/favicons/dark/icon@192.png"
        />
        <link
          rel="icon"
          href="/assets/favicons/light/icon@192.png"
          sizes="192x192"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/assets/favicons/dark/icon@192.png"
          sizes="192x192"
          media="(prefers-color-scheme: dark)"
        />
        {/* Android Shortcut icon */}
        <link rel="shortcut icon" href="/assets/favicons/dark/icon@192.png" />
        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          href="/assets/favicons/dark/icon@192.png"
        />
      </Head>

      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="light"
        value={{
          light: 'light',
          dark: 'dark',
        }}
      >
        <CookieConsent />
        <Component {...pageProps} />
      </ThemeProvider>

      <Analytics />
    </>
  );
};

export default MyApp;
