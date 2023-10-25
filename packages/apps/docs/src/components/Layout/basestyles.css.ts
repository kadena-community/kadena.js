import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { createVar, globalStyle, style } from '@vanilla-extract/css';
import {
  $$backgroundOverlayColor,
  $$leftSideWidth,
  $$pageWidth,
} from './global.css';

globalStyle('html, body', {
  margin: 0,
  backgroundColor: vars.colors.$background,
  overscrollBehavior: 'none',
});

globalStyle('a', {
  color: vars.colors.$primaryContrastInverted,
  textDecoration: 'underline',
});
globalStyle('a:hover', {
  color: vars.colors.$primaryHighContrast,
  textDecoration: 'none',
});
globalStyle('p a', {
  fontWeight: '500',
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

    ...responsiveStyle({
      md: {
        position: 'fixed',
        transform: 'translateX(0)',
      },
    }),
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

    ...responsiveStyle({
      md: {
        gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth} - ${$$asideMenuWidthMDDefault})) ${$$asideMenuWidthMDDefault} 1%`,
        gridTemplateAreas: `
          "header header header header header"
          "pageheader pageheader pageheader pageheader pageheader"
          ". menu content aside ."
          "footer footer footer footer footer"
        `,
      },
      xxl: {
        gridTemplateAreas: `
          "header header header header header"
          "pageheader pageheader pageheader pageheader pageheader"
          ". menu content aside ."
          "footer footer footer footer footer"
        `,
        gridTemplateColumns: `minmax(1%, auto) ${$$leftSideWidth} calc(${$$pageWidth} - ${$$leftSideWidth}) 0 minmax(1%, auto)`,
      },
    }),
  },
]);
