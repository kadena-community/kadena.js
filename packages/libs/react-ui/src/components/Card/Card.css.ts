import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';

export const containerClass = style([
  atoms({
    backgroundColor: 'base.default',
    color: 'text.base.default',
    paddingInline: 'xxl',
    paddingBlock: 'lg',
    borderRadius: 'sm',
    border: 'hairline',
    position: 'relative',
  }),
  {
    maxWidth: '100%',
    width: 'max-content',
  },
]);

export const fullWidthClass = style({ width: '100%' });

export const disabledClass = style([
  atoms({
    pointerEvents: 'none',
  }),
  {
    opacity: 0.5,
  },
]);
