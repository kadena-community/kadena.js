import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const dividerClass = style([
  sprinkles({
    backgroundColor: '$borderDefault',
    width: '100%',
    marginY: '$10',
    border: 'none',
  }),
  {
    height: vars.borderWidths.$sm,
  },
]);
