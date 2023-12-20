import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    marginBlock: '$5',
    marginInline: 0,
  }),
  {},
]);
