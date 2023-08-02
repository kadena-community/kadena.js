import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const mainContentStyle = style([
  {
    width: '680px',
  },
]);

export const submitStyle = style([
  {
    float: 'right',
  },
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
