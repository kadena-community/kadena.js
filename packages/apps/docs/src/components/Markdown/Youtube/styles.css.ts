import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    width: '100%',
  }),
  {
    aspectRatio: '16 / 9',
  },
]);
