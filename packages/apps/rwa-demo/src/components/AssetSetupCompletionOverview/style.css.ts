import { style } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';

export const progressRing = style({
  position: 'absolute',
  transform: 'rotate(-90deg)' /* Start from top */,
});

export const progressRingCircle = style({
  transition: 'stroke-dashoffset 0.35s',
  transform: 'rotate(0.25turn)',
  transformOrigin: '50% 50%',
  stroke: token('color.icon.brand.primary.default'),
});

export const progressRingBackground = style({
  stroke: token('color.icon.brand.primary.inverse.@active'),
  opacity: 0.2,
});
