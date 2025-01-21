import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  atoms({
    backgroundColor: 'semantic.info.default',
  }),
  {
    position: 'relative',
    top: 'unset',
    zIndex: 9999,
  },
]);

export const notificationWrapperClass = style([
  {
    marginInline: 'auto',
  },
]);
