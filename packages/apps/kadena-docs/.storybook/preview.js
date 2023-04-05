import {
  darkTheme,
  globalCss,
  baseGlobalStyles,
} from '@kadena-ui/react-components';
import { themes } from '@storybook/theming';

const globalStyles = globalCss({
  ...baseGlobalStyles,
});

globalStyles();

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
    darkClass: darkTheme.className,
    lightClass: 'theme',
    current: 'light',
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
};
