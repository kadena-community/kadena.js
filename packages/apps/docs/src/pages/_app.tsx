import {
  baseGlobalStyles,
  darkTheme as stitchesDarkTheme,
  globalCss,
} from '@kadena/react-components';
import { ModalProvider } from '@kadena/react-ui';
// eslint-disable-next-line import/no-unresolved
import { darkThemeClass } from '@kadena/react-ui/theme';

import { Analytics, ConsentModal } from '@/components';
import { Header } from '@/components/Layout/components/Header/Header';
import { markDownComponents } from '@/components/Markdown';
import { MenuProvider, ThemeProvider } from '@/hooks';
import { IPageMeta, IPageProps } from '@/types/Layout';
import { getLayout } from '@/utils';
import onExternalButtonClick from '@/utils/onExternalButtonClick';
import { MDXProvider } from '@mdx-js/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { FC, useEffect } from 'react';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

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

  const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { href } = (event as any).originalTarget.activeElement;
    onExternalButtonClick(href);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload, {
      capture: true,
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, {
        capture: true,
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>{props.frontmatter.title}</title>
        <meta name="title" content={props.frontmatter.title} />
        <meta name="description" content={props.frontmatter.description} />
      </Head>
      <MDXProvider components={markDownComponents}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
          value={{
            light: 'light',
            dark: `${darkThemeClass} ${stitchesDarkTheme.className}`,
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
