import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';

export const underlayClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    inset: 0,
    backgroundColor: 'base.default',
  }),
  {
    backdropFilter: 'blur(12px)',
  },
]);
