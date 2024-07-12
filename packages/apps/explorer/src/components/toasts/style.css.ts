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
    transition: 'transform 0.9s ease, opacity 0.9s ease',
    transform: 'translateY(0px)',
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

export const isNewClass = style({
  transition: 'transform 0s ease, opacity 0s ease',
  transform: 'translateY(100px)',
});

export const notificationClass = style({
  transition: 'transform 0.9s ease, opacity 0.9s ease',
  position: 'relative',
  transform: 'translateY(0px)',
  opacity: 1,
  pointerEvents: 'all',
});
export const hideAnimationClass = style({
  transform: 'translateY(-100px)',
  opacity: 0,
});
