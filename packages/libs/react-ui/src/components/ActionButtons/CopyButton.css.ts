import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const copyButtonClass = style([
  sprinkles({
    top: '$2',
    right: '$2',
    position: 'absolute',
    padding: '$2',
  }),
]);
