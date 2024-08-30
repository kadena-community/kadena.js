// NOTE: Refer to https://www.joshwcomeau.com/css/custom-css-reset/ for more detailed explanation
import { globalFontFace } from '@vanilla-extract/css';
import { globalStyle } from '../styles';
import { lightThemeValues } from './tokens/light.css';

// eslint-disable-next-line @kadena-dev/typedef-var
export const primaryFont =
  lightThemeValues.kda.foundation.typography.family.primaryFont;
export const secondaryFont =
  lightThemeValues.kda.foundation.typography.family.secondaryFont;
export const monospaceFont =
  lightThemeValues.kda.foundation.typography.family.monospaceFont;

// Inter
globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')`,
  unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB`,
});
globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')`,
  unicodeRange: `U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF`,
});
globalFontFace(primaryFont, {
  fontStyle: 'normal',
  fontWeight: '300, 700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')`,
  unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
});

// Inter
globalFontFace(secondaryFont, {
  fontWeight: '300, 700',
  src: "url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2')",
});

// Kode mono
globalFontFace(monospaceFont, {
  fontStyle: 'normal',
  fontWeight: '400..700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/kodemono/v2/A2BLn5pb0QgtVEPFnlYkkaoBgw4qv9odq5myxDOZacezE3hnRicF.woff2) format('woff2')`,
  unicodeRange: `U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF`,
});
globalFontFace(monospaceFont, {
  fontStyle: 'normal',
  fontWeight: '400..700',
  fontDisplay: 'swap',
  src: `url(https://fonts.gstatic.com/s/kodemono/v2/A2BLn5pb0QgtVEPFnlYkkaoBgw4qv9odq5myxD2ZacezE3hnRg.woff2) format('woff2')`,
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
  fontFamily: primaryFont,
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
});

globalStyle('img, picture, video, canvas', {
  maxWidth: '100%',
});

/*
    7. Remove built-in form typography styles
*/
globalStyle('button, input, select, textarea, label', {
  fontFamily: primaryFont,
});

/*
    8. Avoid text overflows
*/
globalStyle('p, h1, h2, h3, h4, h5, h6, span, li', {
  overflowWrap: 'break-word',
});

globalStyle(
  '#storybook-docs p, #storybook-docs h1, #storybook-docs h2, #storybook-docs h3, #storybook-docs h4, #storybook-docs h5, #storybook-docs h6, #storybook-docs span, #storybook-docs li',
  {
    fontFamily: `${primaryFont} !important`,
  },
);

/*
    9. Create a root stacking context
*/
globalStyle('#root, #__next', {
  isolation: 'isolate',
});
