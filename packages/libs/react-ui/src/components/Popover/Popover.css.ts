import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export const underlayClass = style({
  position: 'fixed',
  inset: '0',
  zIndex: token('zIndex.overlay'),
});

export const popoverClass = atoms({
  backgroundColor: 'base.default',
  borderRadius: 'sm',
});

export const arrowClass = style({
  width: '12px',
  fill: `var(--popover-arrow-color, white)`,
  position: 'absolute',
  selectors: {
    "&[data-placement='top']": {
      top: '100%',
      transform: ' translate(-50%)',
    },
    "&[data-placement='bottom']": {
      bottom: '100%',
      transform: 'translate(-50%) rotate(180deg)',
    },
    "&[data-placement='left']": {
      left: '100%',
      transform: 'translateY(-50%) rotate(-90deg)',
    },
    "&[data-placement='right']": {
      right: ' 100%',
      transform: ' translateY(-50%) rotate(90deg)',
    },
  },
});
