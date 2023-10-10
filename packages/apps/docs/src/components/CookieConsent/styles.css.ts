import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const notificationClass = style([
  sprinkles({
    position: 'relative',
  }),
  {
    zIndex: 5,
  },
]);
