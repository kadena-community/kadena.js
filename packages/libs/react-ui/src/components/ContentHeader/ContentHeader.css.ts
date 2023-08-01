import { style } from '@vanilla-extract/css';
import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';

export const containerClass = style([
  sprinkles({
    display: 'grid',
    gap: '$md',
  }),
  {
    gridRowGap: vars.sizes.$xs,
    alignItems: 'center',
    gridTemplateColumns: 'max-content 1fr',
  },
]);

export const descriptionClass = style({
  gridColumnStart: 2,
});
