import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  atoms({
    height: '100%',
    position: 'relative',
  }),
  {
    width: '680px',
  },
]);

export const notificationContainerStyle = style([
  atoms({ fontSize: 'xs', marginBlock: 'lg' }),
]);
