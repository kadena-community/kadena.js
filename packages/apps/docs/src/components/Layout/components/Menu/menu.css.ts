import { breakpoints, darkThemeClass, sprinkles } from '@kadena/react-ui/theme';

import { $$sideMenu } from '../../global.css';

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
