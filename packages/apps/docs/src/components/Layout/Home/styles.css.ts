import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$asideMenuWidthCode } from '../basestyles.css';
import {
  $$backgroundOverlayColor,
  $$leftSideWidth,
  $$pageWidth,
} from '../global.css';

import { createVar, style } from '@vanilla-extract/css';

export const $$shadowWidth = createVar();

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

        ...responsiveStyle({
          md: {
            backgroundColor: 'transparent',
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          lg: {
            backgroundPositionX: `calc(100vw  - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
          xl: {
            display: 'block',
          },
          xxl: {
            backgroundPositionX: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2 ) - (${$$asideMenuWidthCode} + ${$$shadowWidth}))`,
          },
        }),
      },
      '&::after': {
        backgroundColor: 'transparent',

        ...responsiveStyle({
          md: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${vars.sizes.$4}))`,
          },
          lg: {
            left: `calc(100vw  - (${$$asideMenuWidthCode} +  ${vars.sizes.$4}  + ${vars.sizes.$4}))`,
          },
          xl: {
            backgroundColor: $$backgroundOverlayColor,
          },
          xxl: {
            left: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2) - (${$$asideMenuWidthCode} + ${vars.sizes.$6} ))`,
          },
        }),
      },
    },
  },
]);

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
