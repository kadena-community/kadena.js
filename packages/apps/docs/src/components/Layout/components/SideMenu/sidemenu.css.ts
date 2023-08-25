import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const sideMenuClass = style([
  sprinkles({
    position: 'relative',
    marginTop: '$6',
    height: '100%',
    paddingBottom: '$25',
  }),
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

export const sidemenuTitleClass = style([
  sprinkles({
    display: 'block',
    padding: 0,
    paddingLeft: '$8',
    textAlign: 'left',
  }),
  {
    background: 'transparent',
    border: '0',
  },
]);

export const sidemenuTitleButtonClass = style([
  sprinkles({
    display: {
      sm: 'flex',
      md: 'none',
    },
    paddingLeft: '$8',
    textAlign: 'left',
    cursor: 'pointer',
  }),
  {
    height: 'auto',
    border: '0',
    backgroundColor: 'transparent',

    selectors: {
      '&:hover::before': {
        transform: `translate(0, ${vars.sizes.$2}) rotate(45deg)`,
      },
      '&::before': {
        position: 'absolute',
        left: vars.sizes.$2,
        content: '',
        width: vars.sizes.$2,
        height: vars.sizes.$2,
        borderLeft: `2px solid ${vars.colors.$borderDefault}`,
        borderBottom: `2px solid ${vars.colors.$borderDefault}`,
        transform: `translate(${vars.sizes.$2}, ${vars.sizes.$2}) rotate(45deg)`,
        transition: 'transform .2s ease ',
      },
    },
  },
]);

export const linkClass = style([sprinkles({}), {}]);
