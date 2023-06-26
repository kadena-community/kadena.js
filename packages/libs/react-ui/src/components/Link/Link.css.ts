import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const linkContainerClass = style([
  sprinkles({
    display: 'flex',
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
        color: '#C870FF',
      },
    },
  },
]);

export const iconContainerClass = style([
  sprinkles({
    display: 'flex',
    marginX: '$2',
  }),
  {
    textDecoration: 'none',
  },
]);
