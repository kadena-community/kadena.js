import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/index';
import { style } from '@vanilla-extract/css';

export const dividerClass = style([
  atoms({
    width: '100%',
    marginY: 'xxl',
    border: 'none',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.border.base['@boldest'],
    height: tokens.kda.foundation.border.width.hairline,
  },
]);
