import { darkThemeClass } from '../src/styles';
import { type Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
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
      current: 'light',
      stylePreview: true,
      darkClass: darkThemeClass,
      // Override the default dark theme
      dark: { ...themes.dark, appBg: 'black' },
      // Override the default light theme
      light: { ...themes.normal, appBg: 'white' },
      theme: themes.dark,
    },
    // docs: {
    //   theme: themes.dark,
    // },
  },
};

export default preview;
