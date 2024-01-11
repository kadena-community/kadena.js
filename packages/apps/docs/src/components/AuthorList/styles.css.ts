import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
    width: '100%',
    flexWrap: 'wrap',
  }),
  {
    listStyle: 'none',
  },
]);

export const listItemClass = style([
  atoms({
    width: '100%',
  }),
]);
