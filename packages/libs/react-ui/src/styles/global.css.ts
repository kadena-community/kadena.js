// NOTE: Refer to https://www.joshwcomeau.com/css/custom-css-reset/ for more detailed explanation
import { globalFontFace } from '@vanilla-extract/css';
import { globalStyle } from '../styles';
import { breakpoints } from './themeUtils';
import { monospaceFont, primaryFont, secondaryFont, vars } from './vars.css';

globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.woff2) format('woff2')`,
  unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB`,
});

globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb94C_k3HqUtEw.woff2) format('woff2')`,
  unicodeRange: `U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF`,
});

globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2) format('woff2')`,
  unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
});

// TODO: add inter font
globalFontFace(secondaryFont, {
  fontWeight: '300, 700',
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
});

// Kode mono
globalFontFace(monospaceFont, {
  fontStyle: 'normal',
  fontWeight: '400, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/kodemono/v1/A2BYn5pb0QgtVEPFnlYOk4LweZGZuPcc.woff2) format('woff2')`,
  unicodeRange: `U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF`,
});
globalFontFace(monospaceFont, {
  fontStyle: 'normal',
  fontWeight: '400, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/kodemono/v1/A2BYn5pb0QgtVEPFnlYOnYLweZGZuA.woff2) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
});

/*
    1. Use a more-intuitive box-sizing model.
*/
globalStyle('*, *::before, *::after', {
  boxSizing: `border-box`,
});

/*
    2. Remove default margin
*/
globalStyle('*', {
  margin: 0,
});

/*
    3. Allow percentage-based heights in the application
*/
globalStyle('html, body', {
  height: '100%',
  fontFamily: vars.fonts.$main,
});

/*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
*/
globalStyle('body', {
  lineHeight: 1.4,
  WebkitFontSmoothing: 'antialiased',
});

/*
    6. Improve media defaults
*/
globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

/*
    7. Remove built-in form typography styles
*/
globalStyle('button, input, select, textarea, label', {
  fontFamily: vars.fonts.$main,
});

/*
    8. Avoid text overflows
*/
globalStyle('p, h1, h2, h3, h4, h5, h6, span, li', {
  overflowWrap: 'break-word',
  fontFamily: vars.fonts.$main,
});

/*
    9. Create a root stacking context
*/
globalStyle('#root, #__next', {
  isolation: 'isolate',
});

/*
    10. Kode Design System
*/
globalStyle(':root', {
  vars: {
    '--spacing-2xs': vars.sizes.$1,
    '--spacing-xs': vars.sizes.$2,
    '--spacing-sm': vars.sizes.$3,
    '--spacing-md': vars.sizes.$4,
    '--spacing-lg': vars.sizes.$6,
    '--spacing-xl': vars.sizes.$7,
    '--spacing-2xl': vars.sizes.$9,
    '--spacing-3xl': vars.sizes.$10,
  },
  '@media': {
    [breakpoints.md]: {
      vars: {
        '--spacing-3xl': vars.sizes.$12,
      },
    },
    [breakpoints.lg]: {
      vars: {
        '--spacing-2xl': vars.sizes.$10,
        '--spacing-3xl': vars.sizes.$15,
      },
    },
    [breakpoints.xl]: {
      vars: {
        '--spacing-xl': vars.sizes.$8,
        '--spacing-2xl': vars.sizes.$13,
        '--spacing-3xl': vars.sizes.$20,
      },
    },
    [breakpoints.xxl]: {
      vars: {
        '--spacing-xl': vars.sizes.$11,
        '--spacing-2xl': vars.sizes.$17,
        '--spacing-3xl': vars.sizes.$25,
      },
    },
  },
});
