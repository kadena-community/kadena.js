import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const ContentClass = style([
  sprinkles({
    backgroundColor: '$primarySurfaceInverted',
    borderRadius: '$sm',
    padding: '$2',
    color: '$neutral6',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }),
]);
