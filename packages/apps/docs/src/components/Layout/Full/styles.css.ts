import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';

import {
  $$asideMenuWidthLGDefault,
  $$asideMenuWidthMDDefault,
} from '../basestyles.css';
import { $$leftSideWidth, $$pageWidth, $$sideMenu } from '../global.css';

import { createVar, style } from '@vanilla-extract/css';

const $$shadowWidth = createVar();

export const asidebackgroundClass = style([
  sprinkles({
    display: 'none',
  }),

  {
    vars: {
      [$$shadowWidth]: vars.sizes.$25,
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

        transform: 'scale(.3, 1)  translate(100%, 0)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',

        ...responsiveStyle({
          xxl: {
            backgroundPositionX: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2 ) - (${$$asideMenuWidthLGDefault} +  ${$$shadowWidth}))`,
          },
        }),
      },
      '&::after': {
        ...responsiveStyle({
          lg: {
            left: `calc(100vw  - (${$$asideMenuWidthMDDefault} + ${vars.sizes.$4}))`,
          },
          xxl: {
            left: `calc(${$$pageWidth} + ((100vw - ${$$pageWidth}) /2) - ${$$asideMenuWidthLGDefault})`,
          },
        }),
      },
    },

    ...responsiveStyle({
      lg: {
        display: 'block',
      },
    }),
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

export const pageGridClass = style(
  responsiveStyle({
    lg: {
      gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth} - ${$$asideMenuWidthMDDefault})) ${$$asideMenuWidthMDDefault} 1%`,
    },
    xxl: {
      gridTemplateColumns: `auto ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth} - ${$$asideMenuWidthLGDefault})) ${$$asideMenuWidthLGDefault} auto`,
    },
  }),
);

export const stickyAsideWrapperClass = style([
  sprinkles({
    position: 'sticky',
    display: 'flex',
    top: '$10',
    paddingLeft: '$4',
  }),
]);

export const stickyAsideClass = style([
  sprinkles({
    paddingTop: '$10',
  }),
  {
    overflowY: 'auto',
    height: `calc(100vh - ${vars.sizes.$20})`,
    selectors: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
]);

export const asideClass = style([
  sprinkles({
    display: 'none',
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingY: 0,
    paddingX: '$4',
  }),
  {
    gridArea: 'aside',
    gridColumn: '4 / span 2',
    gridRow: '2 / span 2',
    zIndex: $$sideMenu,
    transform: 'translateX(100vw)',

    ...responsiveStyle({
      lg: {
        display: 'block',
        transform: 'translateX(0)',
      },
    }),
  },
]);
