import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    display: 'grid',
    gap: '$md',
    alignItems: 'center',
  }),
  {
    gridRowGap: vars.sizes.$xs,
    gridTemplateColumns: 'auto 1fr',
  },
]);

export const descriptionClass = style({
  gridColumnStart: 2,
});
