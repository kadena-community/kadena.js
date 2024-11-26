import { recipe } from '@kadena/kode-ui';
import { keyframes } from '@vanilla-extract/css';

const scale = keyframes({
  '0%': { transform: 'scale(1, 1); opacity:0' },
  '20%': { transform: 'scale(1, 1); opacity:.8' },
  '80%': { transform: 'scale(2.5, 2.5); opacity: .8' },
  '100%': { transform: 'scale(.5, .5); opacity:0' },
});

export const animationIconClass = recipe({
  base: {
    position: 'fixed',
    zIndex: 99999,
    opacity: 0,
    pointerEvents: 'none',
  },
  variants: {
    showAnimation: {
      true: {
        animation: `${scale} 2s ease-in-out`,
      },
      false: {},
    },
  },
});
