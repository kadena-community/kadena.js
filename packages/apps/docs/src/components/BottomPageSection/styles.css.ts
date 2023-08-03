import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const bottomWrapper = style([
  sprinkles({
    width: '100%',
  }),
]);

export const bottomWrapperCodeLayout = style([
  {
    '@media': {
      [`screen and ${breakpoints.xl}`]: {
        width: '56%',
      },
      [`screen and ${breakpoints.xxl}`]: {
        width: '60%',
      },
    },
  },
]);
