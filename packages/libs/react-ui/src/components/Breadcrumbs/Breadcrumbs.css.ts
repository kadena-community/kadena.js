import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
  }),
  {
    flexFlow: 'wrap',
    listStyle: 'none',
  },
]);

export const itemClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
    color: '$neutral4',
  }),
  {
    whiteSpace: 'nowrap',
    selectors: {
      '&::before': {
        margin: `0 ${vars.sizes.$2}`,
      },
      '&:not(:first-child):not(:last-child)::before': {
        content: '/',
      },
      '&:last-child::before': {
        content: '∙',
      },
      '&:first-child': {
        fontWeight: 'bold',
      },
      '&:first-child::before': {
        content: '',
        margin: '0',
      },
    },
  },
]);

export const linkClass = style([
  sprinkles({
    display: 'flex',
    color: '$neutral4',
  }),
  {
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const spanClass = style([
  sprinkles({
    marginRight: '$1',
  }),
]);

export const iconContainer = style([
  sprinkles({
    display: 'flex',
    marginX: '$2',
  }),
]);

export const navClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'max-content',
  }),
]);
