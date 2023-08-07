import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const wrapper = style([
  sprinkles({
    width: '100%',
  }),
  {
    aspectRatio: '16 / 9',
  },
]);
