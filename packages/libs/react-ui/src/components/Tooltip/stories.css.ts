import { sprinkles } from '@theme';
import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
]);
