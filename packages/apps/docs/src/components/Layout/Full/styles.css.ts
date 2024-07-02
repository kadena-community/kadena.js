import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { createVar, style } from '@vanilla-extract/css';
import {
  $$asideMenuWidthLGDefault,
  $$asideMenuWidthMDDefault,
} from '../basestyles.css';
import { $$leftSideWidth, $$pageWidth, $$sideMenu } from '../global.css';

const $$shadowWidth = createVar();

export const asidebackgroundClass = style([
  atoms({
    display: 'none',
  }),

  {
    vars: {
      [$$shadowWidth]: tokens.kda.foundation.size.n25,
    },

    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        pointerEvents: 'none',
        inset: 0,
        zIndex: 0,
        // backgroundImage: 'url("/assets/bg-code.webp")',
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
            left: `calc(100vw  - (${$$asideMenuWidthMDDefault} + ${tokens.kda.foundation.spacing.md}))`,
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
  atoms({
    position: 'sticky',
    display: 'flex',
    paddingInlineStart: 'md',
  }),
  {
    top: tokens.kda.foundation.size.n10,
  },
]);

export const stickyAsideClass = style([
  atoms({
    paddingBlockStart: 'xxxl',
  }),
  {
    overflowY: 'auto',
    height: `calc(100vh - ${tokens.kda.foundation.size.n20})`,
    selectors: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
]);

export const asideClass = style([
  atoms({
    display: 'none',
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingInline: 'md',
  }),
  {
    paddingBlock: 0,
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
