/* eslint @typescript-eslint/naming-convention: 0 */
import {
  blue,
  crimson,
  cyan,
  green,
  indigo,
  mauve,
  pink,
  plum,
  purple,
  teal,
  violet,
} from '@radix-ui/colors';
import type { PropertyValue, CSS as StitchesCSS } from '@stitches/react';
import { createStitches } from '@stitches/react';

export type { VariantProps } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...mauve,
      ...crimson,
      ...pink,
      ...plum,
      ...purple,
      ...violet,
      ...indigo,
      ...blue,
      ...cyan,
      ...teal,
      ...green,
    },
    fontSizes: {
      '2xs': '0.625rem', // 10px
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px by default
      md: '1.123rem', // 18px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      '2xl': '1.75rem', // 28px
      '3xl': '2rem', // 32px
      '4xl': '2.25rem', // 36px
      '5xl': '2.5rem', //40px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    radii: {
      md: '0.5rem',
      round: '999rem',
    },
    shadows: {
      normal: '0 0.1rem 0.5rem rgba(0, 0, 0, 0.1)',
    },
    space: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
    },
    sizes: {
      blockWidth: '4rem',
    },
  },
  // https://tailwindcss.com/docs/responsive-design
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
  utils: {
    pr: (value: PropertyValue<'paddingRight'>) => ({ paddingRight: value }),
    pl: (value: PropertyValue<'paddingLeft'>) => ({ paddingLeft: value }),
    pt: (value: PropertyValue<'paddingTop'>) => ({ paddingTop: value }),
    pb: (value: PropertyValue<'paddingBottom'>) => ({ paddingBottom: value }),
    px: (value: PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
      paddingLeft: value,
    }),
    py: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    p: (value: PropertyValue<'paddingTop'>) => ({
      padding: value,
    }),
    mr: (value: PropertyValue<'marginRight'>) => ({ marginRight: value }),
    ml: (value: PropertyValue<'marginLeft'>) => ({ marginLeft: value }),
    mt: (value: PropertyValue<'marginTop'>) => ({ marginTop: value }),
    mb: (value: PropertyValue<'marginBottom'>) => ({ marginBottom: value }),
    mx: (value: PropertyValue<'marginRight'>) => ({
      marginRight: value,
      marginLeft: value,
    }),
    my: (value: PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    m: (value: PropertyValue<'marginTop'>) => ({
      margin: value,
    }),
  },
});

export type CSS = StitchesCSS<typeof config>;
