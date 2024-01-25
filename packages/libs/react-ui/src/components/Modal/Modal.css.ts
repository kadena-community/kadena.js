import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';

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
    // TODO: Update to use token
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
  },
]);
