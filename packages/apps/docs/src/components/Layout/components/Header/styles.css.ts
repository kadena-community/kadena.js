import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const hamburgerButtonClass = style([
  sprinkles({
    backgroundColor: '$neutral4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$lg',
    width: '$11',
    height: '$11',
    cursor: 'pointer',
    color: '$neutral2',
  }),

  {
    border: 0,
    transition: `opacity 0.2s ease`,
    selectors: {
      '&:hover': {
        backgroundColor: vars.colors.$neutral4,
        opacity: '.6',
      },
    },
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        display: 'none',
      },
    },
  },
]);
