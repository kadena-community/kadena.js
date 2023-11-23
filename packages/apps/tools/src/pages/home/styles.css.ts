import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const homeWrapperClass = style([
  sprinkles({
    paddingRight: '$16',
  }),
]);

export const helpCenterButtonClass = style([
  sprinkles({
    color: '$blue80',
    cursor: 'pointer',
  }),
]);

export const linkStyle = style([
  sprinkles({
    color: '$blue80',
  }),
  {
    selectors: {
      [`&.visited`]: {
        color: vars.colors.$blue60,
      },
    },
  },
]);
