import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const totalScreenHeightClass = style([
  atoms({
    paddingBlockEnd: 'lg',
  }),
  {
    height: '100dvh',
  },
]);
