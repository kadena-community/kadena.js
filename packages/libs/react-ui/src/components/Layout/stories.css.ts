import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const itemClass = style([
  sprinkles({
    backgroundColor: '$primaryContrast',
    color: '$primarySurface',
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
    width: '100%',
  }),
]);

export const componentClass = style([
  sprinkles({
    backgroundColor: '$primarySurface',
    color: '$primaryContrast',
  }),
]);
