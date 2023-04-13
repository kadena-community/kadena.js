import { baseGlobalStyles, globalCss } from '@kadena/react-components';

import { Main } from '@/components/Layout/components';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React, { ComponentType } from 'react';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  return (
    <>
      <ThemeProvider>
        <Main {...pageProps}>
          <ReactComponent {...pageProps} />
        </Main>
      </ThemeProvider>
    </>
  );
}
