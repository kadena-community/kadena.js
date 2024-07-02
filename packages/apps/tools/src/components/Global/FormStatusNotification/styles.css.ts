import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({ marginBlock: 'lg', width: '100%' }),
  { maxWidth: '100%' },
]);
