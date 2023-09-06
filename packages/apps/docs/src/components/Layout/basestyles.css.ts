import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import {
  $$backgroundOverlayColor,
  $$leftSideWidth,
  $$pageWidth,
} from './global.css';

import { createVar, globalStyle, style } from '@vanilla-extract/css';

globalStyle('html, body', {
  backgroundColor: vars.colors.$background,
});

globalStyle('a', {
  color: vars.colors.$primaryContrast,
});
globalStyle('a:hover', {
  color: vars.colors.$primaryHighContrast,
});

export const basebackgroundClass = style([
  sprinkles({
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
  }),
  {
    width: '100vw',
    height: '100vh',
    transform: 'translateX(100vw)',

    selectors: {
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        backgroundColor: $$backgroundOverlayColor,
        zIndex: 1,
      },
    },

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        position: 'fixed',
        transform: 'translateX(0)',
      },
    },
  },
]);

export const $$asideMenuWidthCode = createVar();
export const $$asideMenuWidthMDDefault = createVar();
export const $$asideMenuWidthLGDefault = createVar();

export const baseGridClass = style([
  sprinkles({
    display: 'grid',
    position: 'relative',
    marginY: 0,
    marginX: 'auto',
  }),
  {
    vars: {
      [$$asideMenuWidthMDDefault]: '200px',
      [$$asideMenuWidthLGDefault]: '300px',
      [$$asideMenuWidthCode]: '400px',
    },

    gridTemplateRows: '0 auto 1fr auto',
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
      "header header"
      "pageheader pageheader"
      "content content"
      "footer footer"
    `,

    minHeight: '100vh',

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth} - ${$$asideMenuWidthMDDefault})) ${$$asideMenuWidthMDDefault} 1%`,
        gridTemplateAreas: `
          "header header header header header"
          "pageheader pageheader pageheader pageheader pageheader"
          ". menu content aside ."
          "footer footer footer footer footer"
        `,
      },
      [`screen and ${breakpoints.xxl}`]: {
        gridTemplateColumns: `auto ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth} - ${$$asideMenuWidthLGDefault})) ${$$asideMenuWidthLGDefault} auto`,
      },
    },
  },
]);
