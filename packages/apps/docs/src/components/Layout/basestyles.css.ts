import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { $$leftSideWidth, $$pageWidth } from './global.css';

globalStyle('html, body', {
  margin: 0,
  backgroundColor: tokens.kda.foundation.color.neutral.n0,
  overscrollBehaviorY: 'none',
});

globalStyle('a:not(nav a)', {
  color: tokens.kda.foundation.color.link.brand.primary.default,
  textDecoration: 'underline',
});

globalStyle('a:hover:not(nav a)', {
  color: tokens.kda.foundation.color.link.brand.primary.default['@hover'],
  textDecoration: 'none',
});

globalStyle('p a', {
  fontWeight: '500',
});

export const basebackgroundClass = style([
  atoms({
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
        backgroundColor: 'transparent',
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
  atoms({
    display: 'grid',
    position: 'relative',
    marginBlock: 'no',
    marginInline: 'auto',
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
