import { responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { createVar, style } from '@vanilla-extract/css';
import { $$asideMenuWidthCode } from '../basestyles.css';
import {
  $$backgroundOverlayColor,
  $$leftSideWidth,
  $$pageWidth,
} from '../global.css';

const $$shadowWidth = createVar();

export const codebackgroundClass = style([
  {
    vars: {
      [$$shadowWidth]: tokens.kda.foundation.size.n20,
    },
    selectors: {
      '&::before': {
        display: 'none',
        content: '',
        position: 'absolute',
        pointerEvents: 'none',
        inset: 0,
        backgroundColor: tokens.kda.foundation.color.background.base.default,
        // backgroundImage: 'url("/assets/bg-vertical.webp")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: '-100px',
        backgroundPositionX: '-100px',

        transform: 'scale(.6, 1)  translate(50%, 0)',
        opacity: 0,

        transition: 'transform 1.5s ease, opacity 3s ease-out',
        transitionDelay: '600ms',

        ...responsiveStyle({
          md: {
            backgroundColor: 'transparent',
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          lg: {
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          xxl: {
            display: 'block',
            backgroundPositionX: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2 ) - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
        }),
      },
      '&::after': {
        backgroundColor: 'transparent',
        ...responsiveStyle({
          md: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${tokens.kda.foundation.spacing.md}))`,
          },
          lg: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${tokens.kda.foundation.size.n20} ))`,
          },
          xl: {
            backgroundColor: $$backgroundOverlayColor,
          },
          xxl: {
            left: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2) - (${$$asideMenuWidthCode} + ${tokens.kda.foundation.size.n6} ))`,
          },
        }),
      },
    },
  },
]);

export const loadedClass = style({
  selectors: {
    '&::before': {
      transform: 'scale(1, 1)  translate(0, 0)',
      opacity: 1,
    },
  },
});

export const pageGridClass = style({
  gridTemplateColumns: 'auto auto',
  gridTemplateAreas: `
          "header header"
          "pageheader pageheader"
          "content content"
          "footer footer"
        `,

  ...responsiveStyle({
    md: {
      gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) 1%`,
      gridTemplateAreas: `
            "header header header header"
            "pageheader pageheader pageheader pageheader"
            ". menu content ."
            "footer footer footer footer"
            `,
    },
    xxl: {
      gridTemplateColumns: `minmax(1%, auto) ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) minmax(1%, auto)`,
    },
  }),
});
