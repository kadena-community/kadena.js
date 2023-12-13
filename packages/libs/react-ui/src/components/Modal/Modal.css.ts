import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const underlayClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    cursor: 'pointer',
    inset: 0,
  }),
  {
    // Ask isa
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
]);
