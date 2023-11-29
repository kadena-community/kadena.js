import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import { $$pageWidth, globalClass } from '../Layout/global.css';

export const containerClass = style([
  sprinkles({
    position: 'sticky',
    top: '$17',
    bg: '$primarySurfaceInverted',
  }),
  {
    zIndex: 1000,
  },
]);

export const notificationWrapperClass = style([
  globalClass,
  sprinkles({ marginX: 'auto' }),
  { maxWidth: $$pageWidth },
]);
