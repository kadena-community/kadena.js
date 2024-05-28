import { style } from '@vanilla-extract/css';

export const buttonLinkClass = style([
  {
    textDecoration: 'none',
    color: 'inherit',
    selectors: {
      '&.isDisabled': {
        pointerEvents: 'none',
      },
    },
  },
]);
