import { style, token } from '../../styles';

export const underlayClass = style({
  position: 'fixed',
  inset: '0',
  zIndex: token('zIndex.overlay'),
});

export const popoverClass = style({
  backgroundColor: token('color.background.input.default'),
  overflow: 'auto',
  backdropFilter: 'blur(32px)',
  maxHeight: '100%',
  boxShadow: `0 1px 0 0 ${token('color.border.base.default')}`,
});

export const arrowClass = style({
  width: '12px',
  fill: `var(--popover-arrow-color, white)`,
  position: 'absolute',
  selectors: {
    "&[data-placement='top']": {
      top: '100%',
      transform: 'translate(-50%)',
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
