// NOTE: Refer to https://www.joshwcomeau.com/css/custom-css-reset/ for more detailed explanation
import { KodeMono } from '@kadena/fonts';
import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import { breakpoints } from './themeUtils';
import { vars } from './vars.css';

/*
    0. Add fonts
*/
KodeMono();
globalFontFace('Haas Grotesk Display', {
  fontWeight: 300,
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
});
globalFontFace('Haas Grotesk Display', {
  fontWeight: 400,
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
});
globalFontFace('Haas Grotesk Display', {
  fontWeight: 700,
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
});
globalFontFace('Haas Grotesk Display', {
  fontWeight: 900,
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
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
globalStyle('p, h1, h2, h3, h4, h5, h6, span', {
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
    10. Kadena Design System
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
