import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const tableClass = style([atoms({ width: '100%' })]);
export const listClass = style([
  {
    listStyle: 'none',
    margin: '0',
  },
]);
