import {
  baseGlobalStyles,
  darkTheme,
  globalCss,
} from '@kadena/react-components';

import { Analytics } from '@/components';
import { Main } from '@/components/Layout/components';
import { markDownComponents } from '@/components/Markdown';
import { IPageMeta, PageProps } from '@/types/Layout';
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

type ImportedPagePropsType = Omit<PageProps, 'frontmatter'> & {
  frontmatter: Omit<IPageMeta, 'lastModifiedDate'> & {
    lastModifiedDate: string;
  };
};

const deserializePageProps = (props: ImportedPagePropsType): PageProps => {
  const newProps = JSON.parse(JSON.stringify(props)) as PageProps;
  newProps.frontmatter.lastModifiedDate = new Date(
    props.frontmatter.lastModifiedDate,
  );

  return newProps;
};

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps<ImportedPagePropsType> & {
  Component: FC<PageProps>;
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
            dark: darkTheme.className,
          }}
        >
          <Main {...props}>
            <Component {...props} />
          </Main>
        </ThemeProvider>
      </MDXProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
