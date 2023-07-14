import { sprinkles } from '../../styles';

import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    height: '110vh',
    width: '110vw',
  },
]);
