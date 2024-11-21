import { type Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import { withCenteredStory } from '../src/storyDecorators';
import { darkThemeClass } from '../src/styles';
import { colorPalette } from '../src/styles/colors';
import '../src/styles/global.css';
import './global.css';
import { ThemeProvider } from './ThemeProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      classTarget: 'html',
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
        return React.createElement(ThemeProvider, { ...context });
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
  tags: ['autodocs'],
};

export default preview;
