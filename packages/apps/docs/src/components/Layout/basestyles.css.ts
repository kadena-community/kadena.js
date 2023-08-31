import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import { $$backgroundOverlayColor } from './global.css';

import { style } from '@vanilla-extract/css';

export const basebackgroundClass = style([
  sprinkles({
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
  }),
  {
    width: '100vw',
    height: '100vh',
    transform: 'translateX(100vw)',

    selectors: {
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        backgroundColor: $$backgroundOverlayColor,
        zIndex: 1,
      },
    },

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        position: 'fixed',
        transform: 'translateX(0)',
      },
    },
  },
]);
