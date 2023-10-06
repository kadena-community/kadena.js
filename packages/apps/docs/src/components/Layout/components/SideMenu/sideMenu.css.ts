import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const sideMenuClass = style([
  sprinkles({
    position: 'relative',
    height: '100%',
    paddingBottom: '$25',
  }),
  {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
]);

export const listClass = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const listItemClass = style([
  sprinkles({
    paddingTop: '$4',
    paddingBottom: '$2',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
  },
]);

export const sideMenuTitleClass = style([
  sprinkles({
    display: 'block',
    padding: 0,
    paddingLeft: '$4',
    marginY: '$4',
    textAlign: 'left',
  }),
  {
    background: 'transparent',
    border: '0',
  },
]);

export const sideMenuTitleButtonClass = style([
  sprinkles({
    display: {
      sm: 'flex',
      md: 'none',
    },
    paddingLeft: '$9',
    textAlign: 'left',
    cursor: 'pointer',
  }),
  {
    border: '0',
    backgroundColor: 'transparent',

    selectors: {
      '&:hover::before': {
        transform: `translate(0, ${vars.sizes.$2}) rotate(45deg)`,
      },
      '&::before': {
        position: 'absolute',
        left: vars.sizes.$3,
        content: '',
        width: vars.sizes.$2,
        height: vars.sizes.$2,
        borderLeft: `2px solid ${vars.colors.$foreground}`,
        borderBottom: `2px solid ${vars.colors.$foreground}`,
        transform: `translate(${vars.sizes.$2}, ${vars.sizes.$2}) rotate(45deg)`,
        transition: 'transform .2s ease ',
      },
    },
  },
]);
