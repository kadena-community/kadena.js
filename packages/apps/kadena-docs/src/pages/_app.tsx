import {
  baseGlobalStyles,
  darkTheme,
  globalCss,
} from '@kadena/react-components';

import { Main } from '@/components/Layout/components';
import { markDownComponents } from '@/components/Markdown';
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

export const MyApp = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps,
}: AppProps & { Component: FC }): JSX.Element => {
  return (
    <MDXProvider components={markDownComponents}>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        value={{
          light: 'light',
          dark: darkTheme.className,
        }}
      >
        <Main {...pageProps}>
          <Component {...pageProps} />
        </Main>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default MyApp;
