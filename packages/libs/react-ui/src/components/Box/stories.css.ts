import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  {
    border: `1px solid ${vars.colors.$primaryAccent}`,
  },
]);

export const contentClass = style([
  sprinkles({
    backgroundColor: '$primaryContrast',
    padding: '$6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '$neutral6',
  }),
]);
