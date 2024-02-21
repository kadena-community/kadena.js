import { style } from '@vanilla-extract/css';

export const containerClass = style([
  {
    zIndex: 1000,
    position: 'sticky',
  },
]);

export const notificationWrapperClass = style([
  {
    marginInline: 'auto',
    maxWidth: '100%',
    position: 'relative',
    zIndex: 9999,
  },
]);
