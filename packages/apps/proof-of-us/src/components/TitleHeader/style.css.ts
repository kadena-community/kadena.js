import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const spacerClass = style([
  atoms({
    flex: 1,
  }),
]);
export const titleClass = style([
  {
    textTransform: 'capitalize',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);
