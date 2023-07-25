import {
  baseGlobalStyles,
  darkTheme as stitchesDarkTheme,
  globalCss,
} from '@kadena/react-components';
import { ModalProvider } from '@kadena/react-ui';
// eslint-disable-next-line import/no-unresolved
import { darkThemeClass } from '@kadena/react-ui/theme';

import { Analytics, ConsentModal } from '@/components';
import { markDownComponents } from '@/components/Markdown';
import { ThemeProvider } from '@/hooks';
import { IPageMeta, IPageProps } from '@/types/Layout';
import { getLayout } from '@/utils';
import { MDXProvider } from '@mdx-js/react';
import { AppProps } from 'next/app';
import React, { FC } from 'react';

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

  return (
    <>
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
            <Layout {...props}>
              <Component {...props} />
            </Layout>
            <ConsentModal />
          </ModalProvider>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
