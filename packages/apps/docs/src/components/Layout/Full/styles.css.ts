import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$pageWidth } from '../global.css';

import { createVar, style } from '@vanilla-extract/css';

export const $$shadowWidth = createVar();
export const $$asideMenuWidthCode = createVar();
export const $$asideMenuWidthMDDefault = createVar();
export const $$asideMenuWidthLGDefault = createVar();

export const asidebackgroundClass = style([
  sprinkles({
    display: 'none',
  }),

  {
    vars: {
      [$$shadowWidth]: vars.sizes.$25,
      [$$asideMenuWidthCode]: '400px',
      [$$asideMenuWidthMDDefault]: '200px',
      [$$asideMenuWidthLGDefault]: '300px',
    },

    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        pointerEvents: 'none',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url("/assets/bg-code.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: '-100px',
        backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthMDDefault} + ${$$shadowWidth}))`,

        '@media': {
          [`screen and ${breakpoints.xxl}`]: {
            backgroundPositionX: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2 ) - (${$$asideMenuWidthLGDefault} +  ${$$shadowWidth}))`,
          },
        },
      },
      '&::after': {
        '@media': {
          [`screen and ${breakpoints.md}`]: {
            left: `calc(100vw  - (${$$asideMenuWidthMDDefault} + ${vars.sizes.$4}))`,
          },
          [`screen and ${breakpoints.xxl}`]: {
            left: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2) - ${$$asideMenuWidthLGDefault})`,
          },
        },
      },
    },

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        display: 'block',
      },
    },
  },
]);
