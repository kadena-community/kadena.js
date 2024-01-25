import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/index';

export const dividerClass = style([
  atoms({
    width: '100%',
    marginBlock: 'lg',
    border: 'none',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.border.base.bold,
    height: tokens.kda.foundation.border.width.hairline,
  },
]);
