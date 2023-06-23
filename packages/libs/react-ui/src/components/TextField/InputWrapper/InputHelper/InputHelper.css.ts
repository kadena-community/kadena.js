import { sprinkles } from '../../../../styles';
import { helperIconColor } from '../InputWrapper.css';

import { style } from '@vanilla-extract/css';

export const helperClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: '$xs',
    marginY: '$3',
  }),
]);

export const helperIconClass = style({ color: helperIconColor });
