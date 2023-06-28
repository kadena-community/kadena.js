import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const linkContainerClass = style([
  sprinkles({
    display: 'flex',
    gap: '$2',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
      '&:visited': {
        color: vars.colors.$tertiaryContrast,
      },
    },
  },
]);

export const iconContainerClass = style([
  sprinkles({
    display: 'flex',
    textDecoration: 'none',
  }),
  {},
]);
