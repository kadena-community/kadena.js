import {
  baseGlobalStyles,
  darkTheme,
  globalCss,
} from '@kadena/react-components';

import { Main } from '@/components/Layout/components';
import { markDownComponents } from '@/components/Markdown';
import { IDocsPageFC } from '@/types/Layout';
import { MDXProvider } from '@mdx-js/react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React from 'react';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MyApp = ({
  Component,
  pageProps,
  ...props
}: AppProps): JSX.Element => {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as IDocsPageFC;

  if (ReactComponent.meta !== undefined) {
    pageProps = { ...pageProps, frontmatter: ReactComponent.meta };
  }

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
          <ReactComponent {...pageProps} />
        </Main>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default MyApp;
