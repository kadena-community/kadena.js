import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$asideMenuWidthCode } from '../basestyles.css';
import {
  $$backgroundOverlayColor,
  $$leftSideWidth,
  $$pageWidth,
} from '../global.css';

import { createVar, style } from '@vanilla-extract/css';

const $$shadowWidth = createVar();

export const codebackgroundClass = style([
  sprinkles({}),

  {
    vars: {
      [$$shadowWidth]: vars.sizes.$20,
    },
    selectors: {
      '&::before': {
        display: 'none',
        content: '',
        position: 'absolute',
        pointerEvents: 'none',
        inset: 0,
        backgroundColor: vars.colors.$background,
        backgroundImage: 'url("/assets/bg-vertical.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: '-100px',
        backgroundPositionX: '-100px',

        transform: 'scale(.3, 1)  translate(100%, 0)',
        opacity: 0,

        transition: 'transform 1.5s ease, opacity 3s ease',
        transitionDelay: '600ms',

        '@media': {
          [`screen and ${breakpoints.md}`]: {
            backgroundColor: 'transparent',
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          [`screen and ${breakpoints.lg}`]: {
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          [`screen and ${breakpoints.xl}`]: {
            display: 'block',
          },
          [`screen and ${breakpoints.xxl}`]: {
            backgroundPositionX: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2 ) - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
        },
      },
      '&::after': {
        backgroundColor: 'transparent',
        '@media': {
          [`screen and ${breakpoints.md}`]: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${vars.sizes.$4}))`,
          },
          [`screen and ${breakpoints.lg}`]: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${vars.sizes.$4}  + ${vars.sizes.$4}))`,
          },
          [`screen and ${breakpoints.xl}`]: {
            backgroundColor: $$backgroundOverlayColor,
          },
          [`screen and ${breakpoints.xxl}`]: {
            left: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2) - (${$$asideMenuWidthCode} + ${vars.sizes.$6} ))`,
          },
        },
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
  '@media': {
    [`screen and ${breakpoints.md}`]: {
      gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) 1%`,

      gridTemplateAreas: `
      "header header header header"
      "pageheader pageheader pageheader pageheader"
      ". menu content ."
      "footer footer footer footer"
      `,
    },
    [`screen and ${breakpoints.xxl}`]: {
      gridTemplateColumns: `minmax(1%, auto) ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) minmax(1%, auto)`,
    },
  },
});
