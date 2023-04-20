import {
  baseGlobalStyles,
  darkTheme,
  globalCss,
} from '@kadena/react-components';

import { Main } from '@/components/Layout/components';
import { IMenuItem } from '@/types/Layout';
import { hasSameBasePath } from '@/utils';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import React, { ComponentType } from 'react';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

interface IAppProps extends AppInitialProps {
  pageProps: {
    menuItems: IMenuItem[];
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  return (
    <>
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
    </>
  );
};

MyApp.getInitialProps = async (context: AppContext): Promise<IAppProps> => {
  const ctx = await App.getInitialProps(context); // error: Argument of type 'NextPageContext' is not assignable to parameter of type 'AppContext'.
  const { pathname } = context.ctx;

  const menuitems = (await import('../data/menu.json')).default as IMenuItem[];
  const root = menuitems.map((item) => {
    if (hasSameBasePath(item.root, pathname)) {
      item.isActive = true;
    } else {
      item.children = [];
    }
    return item;
  });

  return { ...ctx, pageProps: { menuItems: root } };
};

export default MyApp;
