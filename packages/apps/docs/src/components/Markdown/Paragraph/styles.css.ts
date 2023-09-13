import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const paragraphWrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
  {
    wordBreak: 'break-word',
  },
]);
