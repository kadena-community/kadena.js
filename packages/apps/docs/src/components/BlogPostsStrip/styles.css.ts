import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const stripClass = style([
  sprinkles({
    padding: 0,
    display: 'flex',
  }),
  {
    listStyle: 'none',
    flexWrap: 'wrap',
  },
]);

export const stripItemClass = style([
  sprinkles({}),
  {
    flex: '33%',
    selectors: {
      '&:last-child': {
        display: 'none',
      },
    },
  },
]);
