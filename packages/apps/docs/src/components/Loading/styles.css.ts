import { sprinkles } from '@kadena/react-ui/theme';

import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loaderClass = style([
  sprinkles({
    width: '$6',
    height: '$6',
  }),
  {
    animation: `${rotate} 1s infinite linear `,
  },
]);
