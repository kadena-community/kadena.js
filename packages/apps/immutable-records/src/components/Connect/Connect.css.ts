import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    marginY: '$4',
  }),
]);

export const invalidSession = style([
  sprinkles({
    marginY: '$4',
  }),
  {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
]);
