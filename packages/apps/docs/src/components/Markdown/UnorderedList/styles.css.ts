import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const ulListClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
    position: 'relative',
    color: '$neutral4',
  }),
]);
