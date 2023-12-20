import { atoms, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import { $$pageWidth, globalClass } from '../Layout/global.css';

export const containerClass = style([
  atoms({
    position: 'sticky',
    backgroundColor: 'semantic.info.default',
  }),
  {
    top: vars.sizes.$17,
    zIndex: 1000,
  },
]);

export const notificationWrapperClass = style([
  globalClass,
  sprinkles({ marginInline: 'auto' }),
  { maxWidth: $$pageWidth },
]);
