import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  sprinkles({
    paddingY: 0,
    paddingX: '$5',
  }),
  {
    listStyle: 'disc',
  },
]);

export const listItemClass = style([
  sprinkles({
    color: '$primaryContrastInverted',
    lineHeight: '$lg',
  }),
]);

export const linkClass = style([
  sprinkles({
    color: '$primaryContrastInverted',
    textDecoration: 'none',
  }),
  {
    ':hover': {
      color: vars.colors.$primaryHighContrast,
      textDecoration: 'underline',
    },
  },
]);
