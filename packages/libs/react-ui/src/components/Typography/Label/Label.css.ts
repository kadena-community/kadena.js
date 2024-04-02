import { style } from '@vanilla-extract/css';
import { atoms } from '../../../styles/atoms.css';

export const labelClass = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
    fontWeight: 'secondaryFont.bold',
  }),
]);
