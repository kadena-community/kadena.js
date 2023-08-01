import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: '$gray90',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
    },
  },
]);

export const logoClass = style([
  sprinkles({
    display: 'flex',
    marginRight: '$8',
  }),
]);

export const navClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'center',
  }),
]);

export const linkClass = style([
  sprinkles({
    alignItems: 'center',
    color: '$gray40',
    display: 'flex',
    fontSize: '$sm',
    marginRight: '$10',
    marginX: '$1',
    textDecoration: 'none',
  }),
  {
    alignSelf: 'center',
  },
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        textDecoration: 'none',
      },
    },
  },
]);
