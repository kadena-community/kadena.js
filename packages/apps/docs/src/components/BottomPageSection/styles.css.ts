import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  sprinkles({
    marginTop: '$40',
    width: '100%',
  }),
]);

export const bottomWrapperCodeLayoutClass = style([
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
