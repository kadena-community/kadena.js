import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: '$gray90',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: '$16',
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
    marginRight: '$6',
    marginLeft: '$3'
  }),
  {
    alignSelf: 'center'
  }
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
    borderRadius: '$sm',
    color: '$gray40',
    display: 'flex',
    fontSize: '$sm',
    marginRight: '$6',
    marginX: '$1',
    textDecoration: 'none',
  }),
  {
    alignSelf: 'center',
    padding: '4px 8px 4px 4px',
  },
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$white,
        textDecoration: 'none',
      },
      '&:focus': {
        color: vars.colors.$blue40,
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$gray90,
        backgroundColor: vars.colors.$white,
        textDecoration: 'none',
      },
    },
  },
]);
