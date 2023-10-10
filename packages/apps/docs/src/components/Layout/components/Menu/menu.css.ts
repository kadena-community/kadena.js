import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$leftSideWidth, $$sideMenu } from '../../global.css';

import { style, styleVariants } from '@vanilla-extract/css';

export const menuClass = style([
  sprinkles({
    position: 'fixed',
    height: '100%',
    width: '100%',
    background: '$background',
    overflow: 'hidden',
    top: '$17',
    bottom: 0,
    paddingBottom: '$4',
  }),
  {
    height: `calc(100vh - ${vars.sizes.$13})`,
    gridArea: 'menu',
    gridRow: '2 / span 3',
    zIndex: $$sideMenu,
    borderRight: '1px solid $borderColor',
    transform: 'translateX(-100%)',
    transition: 'transform .3s ease, width .3s ease',
    '@media': {
      [`screen and ${breakpoints.sm}`]: {
        width: $$leftSideWidth,
      },
      [`screen and ${breakpoints.md}`]: {
        position: 'sticky',
        top: vars.sizes.$18,
        bottom: 'auto',
        height: `calc(100vh - ${vars.sizes.$18})`,
        transform: 'translateX(0)',
        background: 'transparent',
        paddingBottom: vars.sizes.$40,
      },
    },
  },
]);

export const menuOpenVariants = styleVariants({
  isOpen: { transform: 'translateX(0)' },
  isClosed: {
    transform: 'translateX(-100%)',

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        transform: 'translateX(0)',
      },
    },
  },
});

export const menuInLayoutVariants = styleVariants({
  true: [
    sprinkles({
      display: 'block',
    }),
  ],
  false: [
    sprinkles({
      display: 'block',
    }),
    {
      '@media': {
        [`screen and ${breakpoints.md}`]: {
          display: 'none',
        },
      },
    },
  ],
});

export const menuLayoutVariants = styleVariants({
  landing: {
    '@media': {
      [`screen and ${breakpoints.md}`]: {},
    },
  },
  normal: {},
});

export const menuBackClass = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    cursor: 'pointer',
  }),
  {
    background: 'rgba(0,0,0,.5)',
    border: 0,
    opacity: 0,
    transform: 'translateX(-100%)',
    transition: 'opacity .5s ease, transform .1s ease',
    zIndex: `calc(${$$sideMenu} - 1)`,

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  },
]);

export const menuBackOpenVariants = styleVariants({
  isOpen: {
    transform: 'translateX(0)',
    opacity: 1,
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        transform: 'translateX(-100%)',
        opacity: 0,
      },
    },
  },
  isClosed: {
    transform: 'translateX(-100%)',
    pointerEvents: 'none',
    opacity: 0,
  },
});
