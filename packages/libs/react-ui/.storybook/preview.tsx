import { DocsContainer } from '@storybook/addon-docs';
import { type Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { withCenteredStory } from '../src/storyDecorators';
import { darkThemeClass } from '../src/styles';
import { colorPalette } from '../src/styles/colors';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      classTarget: 'html',
      current: 'light',
      // Override the default dark theme
      dark: { ...themes.dark, appBg: colorPalette.$black },
      darkClass: [darkThemeClass, 'dark-mode'],
      // Override the default light theme
      light: { ...themes.normal, appBg: colorPalette.$white },
      lightClass: ['light-mode'],
      stylePreview: true,
      theme: themes.dark,
    },
    docs: {
      container: (context: any) => {
        const isDark = useDarkMode();

        const props = {
          ...context,
          theme: isDark ? themes.dark : themes.light,
        };

        return React.createElement(DocsContainer, props);
      },
    },
    status: {
      statuses: {
        needsRevision: {
          background: colorPalette.$yellow70,
          color: colorPalette.$white,
        },
        inDevelopment: {
          background: colorPalette.$blue70,
          color: colorPalette.$white,
        },
        experimental: {
          background: colorPalette.$pink70,
          color: colorPalette.$white,
        },
      },
    },
  },
  decorators: [withCenteredStory],
};

export default preview;
