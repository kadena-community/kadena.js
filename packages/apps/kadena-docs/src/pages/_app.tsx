import {
  baseGlobalStyles,
  darkTheme as stitchesDarkTheme,
  globalCss,
} from '@kadena/react-components';
import { darkThemeClass, ModalProvider } from '@kadena/react-ui';

import { Analytics, ConsentModal } from '@/components';
import { Main } from '@/components/Layout/components';
import { markDownComponents } from '@/components/Markdown';
import { IPageMeta, IPageProps } from '@/types/Layout';
import { MDXProvider } from '@mdx-js/react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
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

  return (
    <>
      <MDXProvider components={markDownComponents}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          value={{
            light: 'light',
            dark: stitchesDarkTheme.className,
          }}
        >
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
              <Main {...props}>
                <Component {...props} />
              </Main>
              <ConsentModal />
            </ModalProvider>
          </ThemeProvider>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
