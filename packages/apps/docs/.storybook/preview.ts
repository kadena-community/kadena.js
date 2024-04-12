import { darkThemeClass } from '@kadena/react-ui/styles';

import { themes } from '@storybook/theming';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'; // next 13

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    classTarget: 'body',
    stylePreview: true,
    darkClass: darkThemeClass,
    lightClass: 'theme',
    current: 'light',
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '640px',
          height: '1366px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      laptop: {
        name: 'Laptop',
        styles: {
          width: '1280px',
          height: '768px',
        },
      },
      largeScreen: {
        name: 'Large Screen',
        width: '1536px',
        height: '864px',
      },
    },
  },
};
