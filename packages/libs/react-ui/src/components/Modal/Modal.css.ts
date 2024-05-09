import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';

export const underlayClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    inset: 0,
  }),
  {
    // TODO: Update to use token: please check docs search dialog to align
    backgroundColor: 'rgba(34, 33, 33, 0.8)',
  },
]);
