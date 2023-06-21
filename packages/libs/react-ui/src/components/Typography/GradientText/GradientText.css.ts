import { sprinkles } from '../../../styles';

import { style } from '@vanilla-extract/css';

export const gradientTextClass = style([
  sprinkles({
    fontWeight: '$bold',
  }),
  {
    backgroundColor: 'inherit',
    backgroundImage: 'linear-gradient(50deg, #ff00e9, #00c0ff 90%)',
    backgroundSize: '100%',
    color: 'white',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
]);
