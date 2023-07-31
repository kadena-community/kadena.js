import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const mostPopularWrapper = style([
  sprinkles({
    display: 'flex',
  }),
  {
    paddingLeft: 0,
    '@media': {
      [`screen and (min-width: ${768 / 16}rem)`]: {
        paddingLeft: '60px',
      },
      [`screen and (min-width: ${1024 / 16}rem)`]: {
        paddingLeft: '120px',
      },
      [`screen and (min-width: ${1280 / 16}rem)`]: {
        paddingLeft: '160px',
      },
    },
  },
]);
