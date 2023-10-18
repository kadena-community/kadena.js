import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bodyStyle = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray20',
      darkMode: '$gray100',
    },
  }),
]);
