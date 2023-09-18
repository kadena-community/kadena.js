import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

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

export const stripItemWrapperClass = style([
  sprinkles({
    paddingRight: '$4',
  }),
  {
    flex: '50%',
    selectors: {
      '&:last-child': {
        display: 'flex',
      },
    },

    '@media': {
      [`screen and ${breakpoints.lg}`]: {
        flex: '33%',

        selectors: {
          '&:last-child': {
            display: 'none',
          },
        },
      },
    },
  },
]);

export const stripItemClass = style([
  sprinkles({}),
  {
    selectors: {},
  },
]);

export const figureClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
    width: '100%',
    position: 'relative',
    borderRadius: '$lg',
  }),
  {
    aspectRatio: '20 / 9',
  },
]);
