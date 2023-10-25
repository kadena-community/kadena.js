import { create } from '@storybook/theming';
import { colorPalette } from '../src/styles/colors';

export const KadenaTheme = create({
  base: 'light',

  // UI
  appBg: colorPalette.$white,

  // Typography
  fontBase: "'Haas Grotesk Display', -apple-system, sans-serif",
  fontCode: "'Kode Mono', Menlo, monospace",

  // Brand
  brandTitle: 'Kadena React UI Library',
  brandUrl: 'https://react-ui.kadena.io/',
  brandImage: 'https://kadena.io/wp-content/uploads/2021/10/Logo-SVG-V1.svg',
  brandTarget: '_self',
});
