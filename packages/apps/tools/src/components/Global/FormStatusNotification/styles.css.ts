import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({ marginBlock: 'lg', width: '100%' }),
  { maxWidth: '100%' },
]);
