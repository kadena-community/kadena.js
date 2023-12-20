import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const labelClass = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
    fontWeight: 'bodyFont.bold',
  }),
]);
