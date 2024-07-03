import { darkThemeClass } from '@kadena/kode-ui/styles';
import {
  createVar,
  globalFontFace,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { commitTagClass } from '../Changelog/styles.css';

export const $$navMenu = createVar();
export const $$footerMenu = createVar();
export const $$modalZIndex = createVar();
export const $$pageWidth = createVar();
export const $$leftSideWidth = createVar();
export const $$sideMenu = createVar();
export const $$backgroundOverlayColor = createVar();
export const $$borderColor = createVar();

export const globalClass = style({
  vars: {
    [$$navMenu]: '998', //zIndex
    [$$footerMenu]: '498', //zIndex
    [$$modalZIndex]: '1000', //zIndex
    [$$sideMenu]: '500', //zIndex
    [$$pageWidth]: '1440px', //sizes
    [$$leftSideWidth]: '265px', //sizes
    [$$backgroundOverlayColor]: 'rgba(250,250,250, .8)', //colors
    [$$borderColor]: 'rgba(112, 121, 123, 0.2)', //colors
  },
  selectors: {
    [`${darkThemeClass} &`]: {
      vars: {
        [$$backgroundOverlayColor]: 'rgba(5,5,5, .8)', //colors
        [$$borderColor]: 'rgba(240, 240, 240, 0.2)', //colors
      },
    },
  },
});
const bodyFont = 'globalNeuHaasGrotesk';
globalFontFace(bodyFont, {
  src: `url("/fonts/neuhaas_grotesk_pro55.woff2?#iefix format('woff2')")`,
});

globalStyle(
  `*:not(h1,h2,h3,h4,h5,h6,h7,h8, pre > code span, code, ${commitTagClass})`,
  {
    fontFamily: `${bodyFont}!important`,
  },
);
