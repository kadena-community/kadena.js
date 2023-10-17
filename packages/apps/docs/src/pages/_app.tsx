import { KodeMono } from '@kadena/fonts';
import { ModalProvider } from '@kadena/react-ui';
// eslint-disable-next-line import/no-unresolved
import { darkThemeClass } from '@kadena/react-ui/theme';

import { Analytics } from '@/components/Analytics/Analytics';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { Header } from '@/components/Layout/components/Header/Header';
import { markDownComponents } from '@/components/Markdown';
import { MenuProvider } from '@/hooks/useMenu/MenuProvider';
import type { IPageMeta, IPageProps } from '@/Layout';
import { getLayout } from '@/utils/getLayout';
import { MDXProvider } from '@mdx-js/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import type { FC } from 'react';
import React, { useEffect } from 'react';

KodeMono();

type ImportedPagePropsType = Omit<IPageProps, 'frontmatter'> & {
  frontmatter: Omit<IPageMeta, 'lastModifiedDate'> & {
    lastModifiedDate: string;
  };
};

const deserializePageProps = (props: ImportedPagePropsType): IPageProps => {
  const newProps = JSON.parse(JSON.stringify(props)) as IPageProps;
  newProps.frontmatter.lastModifiedDate = props.frontmatter.lastModifiedDate
    ? new Date(props.frontmatter.lastModifiedDate)
    : undefined;
  return newProps;
};

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps<ImportedPagePropsType> & {
  Component: FC<IPageProps>;
}): JSX.Element => {
  const props = deserializePageProps(pageProps);
  const Layout = getLayout(props.frontmatter.layout);

  // check for a router query
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const { q } = router.query;
      if (q && router.pathname !== '/search') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.replace(`/search?q=${q}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const { title, description, headerImage, authorInfo } = props.frontmatter;
  const defaultImagePath = '/assets/blog/2023/0_s-vXIU_stFVOsfim.png';
  const ogImage = headerImage
    ? `https://docs.kadena.io${headerImage}`
    : `https://docs.kadena.io${defaultImagePath}`;

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
        {authorInfo && (
          <>
            <meta
              property="article:author"
              content={`/authors/${authorInfo.id}`}
            />
            <meta name="author" content={authorInfo.name} />
          </>
        )}
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
      <MDXProvider components={markDownComponents}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
          value={{
            light: 'light',
            dark: darkThemeClass,
          }}
        >
          <ModalProvider>
            <MenuProvider>
              <Header menuItems={props.leftMenuTree} />
              <CookieConsent />
              <Layout {...props}>
                <Component {...props} />
              </Layout>
            </MenuProvider>
          </ModalProvider>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
