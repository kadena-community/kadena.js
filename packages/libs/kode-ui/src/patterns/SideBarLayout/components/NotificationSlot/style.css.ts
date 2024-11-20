import { globalStyle } from '@vanilla-extract/css';
import { atoms, responsiveStyle, style, token } from './../../../../styles';

export const notificationsSlotClass = style([
  atoms({
    position: 'absolute',
    flexDirection: 'column',
    top: 0,
    right: 0,
    width: '100%',
    gap: 'sm',
  }),
  {
    zIndex: token('zIndex.toast'),
    maxWidth: '100%',
  },
  responsiveStyle({
    md: {
      maxWidth: '400px',
    },
  }),
]);

globalStyle(`${notificationsSlotClass} > *:nth-child(n+4)`, {
  display: 'none',
});
