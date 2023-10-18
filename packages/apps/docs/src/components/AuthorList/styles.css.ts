import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
    width: '100%',
    flexWrap: 'wrap',
  }),
  {
    listStyle: 'none',
  },
]);

export const listItemClass = style([
  sprinkles({
    width: '100%',
  }),
]);
