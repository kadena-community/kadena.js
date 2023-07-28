import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const headerClass = style([
  sprinkles({
    backgroundColor: '$gray90',
    color: '$gray20',
  }),
  {
    borderBottom: `1px solid $gray60`,
  },
]);
