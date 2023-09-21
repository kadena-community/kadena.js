import { sprinkles } from '@theme';
import { style } from '@vanilla-extract/css';

export const labelClass = style([
  sprinkles({
    fontSize: '$sm',
    color: '$foreground',
    fontWeight: '$bold',
    textTransform: 'capitalize',
  }),
]);
