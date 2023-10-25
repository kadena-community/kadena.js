import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const notificationClass = style([
  sprinkles({
    position: 'sticky',
    top: '$17',
  }),
  {
    zIndex: 1000,
  },
]);
