import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const listClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
    width: '100%',
    flexWrap: 'wrap',
  }),
  {
    listStyle: 'none',
  },
]);

export const itemClass = style([
  sprinkles({
    display: 'flex',
    paddingX: '$2',
    width: '100%',
  }),
  {
    flex: '100%',

    '@media': {
      [`screen and ${breakpoints.sm}`]: {
        flex: '50%',
      },
      [`screen and ${breakpoints.lg}`]: {
        flex: '33%',
      },
      [`screen and ${breakpoints.xl}`]: {
        flex: '25%',
      },
    },
  },
]);
export const itemLinkClass = style([
  sprinkles({
    display: 'block',
    width: '100%',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);
export const headingClass = style({
  textTransform: 'capitalize',
});
