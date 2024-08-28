import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$pageWidth } from '../Layout/styles.css';

export const containerClass = style([
  atoms({
    backgroundColor: 'semantic.info.default',
  }),
  {
    top: 'unset',
    zIndex: 1000,
  },
]);

export const notificationWrapperClass = style([
  {
    marginInline: 'auto',
    maxWidth: $$pageWidth,
  },
]);
