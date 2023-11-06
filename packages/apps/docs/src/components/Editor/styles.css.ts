import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const lineSuccessClass = style({
  color: 'black',
});
export const lineErrorClass = style({
  color: 'red',
});

export const consoleClass = style([
  sprinkles({
    height: '$40',
    backgroundColor: '$background',
  }),
  {
    overflowY: 'scroll',
  },
]);
