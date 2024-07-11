import { atoms, responsiveStyle, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const toastWrapperClass = style([
  atoms({
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    height: '100%',
    paddingBlock: 'md',
    paddingInline: 'sm',
    justifyContent: 'flex-end',
  }),
  {
    width: '100vw',
    zIndex: token('zIndex.dialog'),
    pointerEvents: 'none',
  },
  responsiveStyle({
    md: {
      width: '70vw',
    },
    lg: {
      width: '50vw',
    },
  }),
]);

export const notificationClass = style({
  transition: 'all 0.9s ease',
  position: 'relative',
  transform: 'translateY(0px)',
  opacity: 1,
});
export const hideAnimationClass = style({
  transform: 'translateY(-100px)',
  opacity: 0,
});
export const showAnimationClass = style({
  transform: 'translateY(0px)',
});
