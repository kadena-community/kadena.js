import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$backgroundOverlayColor, $$pageWidth } from '../global.css';

import { createVar, style } from '@vanilla-extract/css';

export const $$shadowWidth = createVar();
export const $$asideMenuWidthCode = createVar();

export const codebackgroundClass = style([
  sprinkles({}),

  {
    vars: {
      [$$shadowWidth]: vars.sizes.$20,
      [$$asideMenuWidthCode]: '400px',
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
