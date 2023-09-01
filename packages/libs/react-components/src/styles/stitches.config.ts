/* eslint @typescript-eslint/naming-convention: 0 */

import { colors, colorsDark } from './colors';

import { type CSS as StitchesCSS, type PropertyValue } from '@stitches/react';
import { createStitches } from '@stitches/react';
import { type ConfigType } from '@stitches/react/types/config';

const sizes: Record<string, string> = {
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  13: '3.25rem', // 52px
  14: '3.5rem', // 56px
  15: '3.75rem', // 60px
  16: '4rem', // 64px
  17: '4.25rem', // 68px
  18: '4.5rem', // 72px
  19: '4.75rem', // 76px
  20: '5rem', // 80px
  24: '6rem', // 96px
  25: '6.25rem', // 100px
  32: '8rem', // 128px
  35: '8.75rem', // 140px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
  // NOTE: These are defined in global styles and vary in size depending on breakpoints
  // See: https://github.com/stitchesjs/stitches/discussions/284
  '2xs': 'var(--spacing-2xs)',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
};

export const media: ConfigType.Media<{
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}> = {
  sm: `(min-width: ${640 / 16}rem)`,
  md: `(min-width: ${768 / 16}rem)`,
  lg: `(min-width: ${1024 / 16}rem)`,
  xl: `(min-width: ${1280 / 16}rem)`,
  '2xl': `(min-width: ${1440 / 16}rem)`,
} as const;

export const {
  styled,
  css,
  config,
  theme,
  getCssText,
  createTheme,
  globalCss,
  keyframes,
} = createStitches({
  theme: {
    colors: {
      ...colors,
      background: '$colors$neutral1',
      backgroundOverlayColor: 'rgba(250,250,250, .8)',
      foreground: '$colors$neutral6',
      borderColor: 'rgba(112, 121, 123, 0.2)',
    },
    fonts: {
      main: "'Haas Grotesk Display', -apple-system, sans-serif",
      mono: "'Kode Mono', Menlo, monospace",
    },
    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      md: '1.123rem', // 18px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      '2xl': '1.75rem', // 28px
      '3xl': '2rem', // 32px
      '4xl': '2.25rem', // 36px
      '5xl': '2.5rem', // 40px
      '6xl': '2.75rem', // 44px
      '7xl': '3rem', // 48px
      '8xl': '3.25rem', // 52px
      '9xl': '3.75rem', // 60px
      '10xl': '4.5rem', // 72px
      '11xl': '5rem', // 80px
      '12xl': '5.25rem', // 84px
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semiBold: 700,
      bold: 700,
    },
    lineHeights: {
      base: 1.4,
      lg: 1.9,
      code: 1.9,
    },
    radii: {
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      round: '999rem',
    },
    shadows: {
      // TODO: Update to match design system
      1: `0px 1px 2px 0 $colors$neutral3`,
      card: `0px 0px 10px $colors$neutral2`,
    },
    space: {
      ...sizes,
    },
    sizes: {
      ...sizes,
      leftSideWidth: '265px',
      pageWidth: '1440px',
    },
    zIndices: {
      navMenu: 998,
      sideMenu: 100,
      modal: 999,
    },
  },
  media,
  // NOTE: There is a typescript serialization error when using PropertyValue.
  // To enable these utils in an application, set `declaration: "false"` in the tsconfig.json.
  // This work around will not work for this library since we need to generate types for consuming applications.
  // We've updated to @stitches/react to v1.3.1-1 to fix this issue.
  // github issue: https://github.com/microsoft/TypeScript/issues/50720
  utils: {
    bg: (value: PropertyValue<'backgroundColor'>) => ({
      backgroundColor: value,
    }),
    size: (value: PropertyValue<'width'>) => ({
      width: value,
      height: value,
    }),
    pr: (value: PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
    }),
    pl: (value: PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
    }),
    pt: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
    }),
    pb: (value: PropertyValue<'paddingBottom'>) => ({
      paddingBottom: value,
    }),
    px: (value: PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
      paddingLeft: value,
    }),
    py: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    mr: (value: PropertyValue<'marginRight'>) => ({
      marginRight: value,
    }),
    ml: (value: PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
    }),
    mt: (value: PropertyValue<'marginTop'>) => ({ marginTop: value }),
    mb: (value: PropertyValue<'marginBottom'>) => ({
      marginBottom: value,
    }),
    mx: (value: PropertyValue<'marginRight'>) => ({
      marginRight: value,
      marginLeft: value,
    }),
    my: (value: PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
  },
});

export const darkTheme = createTheme('darkTheme', {
  colors: {
    ...colorsDark,
    background: '$colors$neutral1',
    backgroundOverlayColor: 'rgba(5,5,5, .8)',
    foreground: '$colors$neutral6',
    borderColor: 'rgba(240, 240, 240, 0.2)',
  },
});

export type ThemeCSS = StitchesCSS<typeof config>;
