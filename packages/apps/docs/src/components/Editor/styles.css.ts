import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';

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

export const editorClass = style([
  sprinkles({}),
  {
    fontFamily: vars.fonts.$mono,
    fontSize: 'inherit',
  },
]);

globalStyle(`${editorClass} span`, {
  fontFamily: vars.fonts.$mono,
});
