import { KodeMono } from '@kadena/fonts';
import { ModalProvider } from '@kadena/react-ui';
// eslint-disable-next-line import/no-unresolved
import { darkThemeClass } from '@kadena/react-ui/theme';

import { Analytics, ConsentModal } from '@/components';
import { Header } from '@/components/Layout/components/Header/Header';
import { markDownComponents } from '@/components/Markdown';
import { MenuProvider } from '@/hooks';
import type { IPageMeta, IPageProps } from '@/types/Layout';
import { getLayout } from '@/utils';
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

  return (
    <>
      <Head>
        <title>{props.frontmatter.title}</title>
        <meta name="title" content={props.frontmatter.title} />
        <meta name="description" content={props.frontmatter.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/assets/light/icon@32.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/assets/dark/icon@32.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          sizes="any"
          href="/assets/light/icon@192.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          sizes="any"
          href="/assets/dark/icon@192.png"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="apple-touch-icon" href="/assets/dark/icon@512.png" />
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
              <Layout {...props}>
                <Component {...props} />
              </Layout>
              <ConsentModal />
            </MenuProvider>
          </ModalProvider>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
