import { darkTheme, lightTheme } from '../src/styles';
import { themes } from '@storybook/theming';
import '../src/styles/global.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    classTarget: 'body',
    stylePreview: true,
    darkClass: darkTheme,
    lightClass: lightTheme,
    current: lightTheme,
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
};
