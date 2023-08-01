import { style } from '@vanilla-extract/css';
import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';

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
