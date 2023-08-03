import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const list = style([
  sprinkles({
    paddingY: 0,
    paddingX: '$5',
  }),
  {
    listStyle: 'disc',
  },
]);

export const listItem = style([
  sprinkles({
    color: '$primaryContrast',
    lineHeight: '$lg',
  }),
]);

export const link = style([
  sprinkles({
    color: '$primaryContrast',
    textDecoration: 'none',
  }),
  {
    ':hover': {
      color: vars.colors.$primaryHighContrast,
      textDecoration: 'underline',
    },
  },
]);
