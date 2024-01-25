import { style } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';
import { vars } from '../../styles/vars.css';

export const containerClass = style([
  sprinkles({
    display: 'grid',
    gap: '$md',
    alignItems: 'center',
    color: '$neutral6',
  }),
  {
    gridRowGap: vars.sizes.$xs,
    gridTemplateColumns: 'auto 1fr',
  },
]);

export const descriptionClass = style({
  gridColumnStart: 2,
});
