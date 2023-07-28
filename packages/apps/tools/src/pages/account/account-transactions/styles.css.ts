import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const mainContentStyle = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '$16',
  }),
]);

export const formStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '$8',
  }),
]);
