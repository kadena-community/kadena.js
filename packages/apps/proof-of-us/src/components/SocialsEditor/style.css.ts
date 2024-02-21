import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    padding: 'no',
  }),
  {
    listStyle: 'none',
  },
]);
export const liClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
  }),
]);
