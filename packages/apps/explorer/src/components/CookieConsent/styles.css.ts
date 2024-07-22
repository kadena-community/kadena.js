import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$pageWidth } from '../Layout/styles.css';

export const containerClass = style([
  atoms({
    position: 'sticky',
    backgroundColor: 'semantic.info.default',
  }),
  {
    top: tokens.kda.foundation.size.n16,
    zIndex: 1000,
  },
]);

export const notificationWrapperClass = style([
  {
    marginInline: 'auto',
    maxWidth: $$pageWidth,
  },
]);
