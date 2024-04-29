// load global styles from @kadena/react-ui
import '@kadena/react-ui/global';

// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@/components/Analytics/Analytics';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { Header } from '@/components/Layout/components/Header/Header';
import { markDownComponents } from '@/components/Markdown';
import { MenuProvider } from '@/hooks/useMenu/MenuProvider';
import { getLayout } from '@/utils/getLayout';
import type { IPageMeta, IPageProps } from '@kadena/docs-tools';
import { RouterProvider } from '@kadena/react-ui';
import { darkThemeClass } from '@kadena/react-ui/styles';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect } from 'react';

type ImportedPagePropsType = Omit<IPageProps, 'frontmatter'> & {
  frontmatter: Omit<IPageMeta, 'lastModifiedDate'> & {
    lastModifiedDate: string;
  };
};

const deserializePageProps = (props: ImportedPagePropsType): IPageProps => {
  const newProps = JSON.parse(JSON.stringify(props)) as IPageProps;

  newProps.frontmatter.lastModifiedDate = props.frontmatter?.lastModifiedDate
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

  console.log({ pageProps });
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
  const defaultImagePath = '/assets/og_banner.jpeg';
  const ogImage = headerImage
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${headerImage}`
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${defaultImagePath}`;

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

        <link rel="icon" href="/assets/favicons/icon@32.png?1" sizes="32x32" />
        <link
          rel="icon"
          href="/assets/favicons/icon@128.png?1"
          sizes="128x128"
        />
        <link
          rel="shortcut icon"
          sizes="192x192"
          href="/assets/favicons/icon@192.png?1"
        />
        {/* Android Shortcut icon */}
        <link rel="shortcut icon" href="/assets/favicons/icon@192.png?1" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/assets/favicons/icon@192.png?1" />
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
          <RouterProvider navigate={router.push}>
            <MenuProvider>
              <Header menuItems={props.headerMenuItems} />
              <CookieConsent />
              <Layout {...props}>
                <Component {...props} />
              </Layout>
            </MenuProvider>
          </RouterProvider>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
