import { sprinkles } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const bodyStyle = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray20',
      darkMode: '$gray100',
    },
  }),
]);
