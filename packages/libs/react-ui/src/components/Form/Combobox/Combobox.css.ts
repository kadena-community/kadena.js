import { style } from '@vanilla-extract/css';
import { atoms } from '../../../styles';

export const comboBoxControlClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'input.default',
    border: 'none',
    color: 'text.base.default',
    outline: 'none',
    flex: 1,
    overflow: 'hidden',
  }),
]);
