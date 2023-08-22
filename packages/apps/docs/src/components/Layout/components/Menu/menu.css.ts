import { breakpoints, darkThemeClass, sprinkles } from '@kadena/react-ui/theme';

import { $$leftSideWidth, $$sideMenu } from '../../global.css';

import { style, styleVariants } from '@vanilla-extract/css';

export const menuClass = style([
  sprinkles({
    position: 'absolute',
    paddingBottom: '$40',
    height: '100%',
    width: '100%',
    background: '$background',
    overflow: 'hidden',
  }),
  {
    gridArea: 'menu',
    gridRow: '2 / span 2',
    zIndex: $$sideMenu,
    borderRight: '1px solid $borderColor',
    transform: 'translateX(-100%)',
    transition: 'transform .3s ease, width .3s ease',
    '@media': {
      [`screen and ${breakpoints.sm}`]: {
        width: $$leftSideWidth,
      },
      [`screen and ${breakpoints.md}`]: {
        position: 'relative',
        transform: 'translateX(0)',
        background: 'transparent',
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
      [`screen and ${breakpoints.md}`]: {
        paddingTop: '290px',
      },
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
