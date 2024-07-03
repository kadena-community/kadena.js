import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const totalScreenHeightClass = style([
  atoms({
    paddingBlockEnd: 'lg',
  }),
  {
    height: '100dvh',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
]);
