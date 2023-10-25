import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const linkClass = style([
  sprinkles({
    color: '$primarySurface',
    fontWeight: '$medium',
  }),
]);
