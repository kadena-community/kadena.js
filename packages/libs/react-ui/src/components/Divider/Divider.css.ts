import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/index';
import { style } from '@vanilla-extract/css';

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
