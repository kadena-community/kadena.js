import { atoms, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import { $$pageWidth, globalClass } from '../Layout/global.css';

export const containerClass = style([
  atoms({
    position: 'sticky',
    backgroundColor: 'semantic.info.default',
  }),
  {
    top: tokens.kda.foundation.size.n17,
    zIndex: 1000,
  },
]);

export const notificationWrapperClass = style([
  globalClass,
  {
    marginInline: 'auto',
    maxWidth: $$pageWidth,
  },
]);
