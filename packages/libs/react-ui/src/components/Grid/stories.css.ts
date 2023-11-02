import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const itemClass = style([
  sprinkles({
    borderRadius: '$sm',
    backgroundColor: '$primarySurface',
    padding: '$6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
]);

export const containerClass = style([
  sprinkles({
    backgroundColor: 'transparent',
    borderColor: '$primaryAccent',
    borderStyle: 'solid',
    borderWidth: '$sm',
  }),
]);

export const gridClass = style([
  sprinkles({
    backgroundColor: '$primaryContrast',
  }),
]);
