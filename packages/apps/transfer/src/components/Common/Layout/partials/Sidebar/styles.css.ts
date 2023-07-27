import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const sidebarClass = style([
  sprinkles({
    position: 'fixed',
    left: 0,
    top: '$16',
    bottom: '$10',
    backgroundColor: '$gray90',
    display: 'flex',
  }),
]);

export const gridItemMiniMenuStyle = style([
  {
    height: '100%',
    borderRight: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const gridMiniMenuListButtonStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '$neutral2',
    padding: '$5',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    selectors: {
      '&:hover': {
        color: vars.colors.$white,
      },
      '&:active': {
        color: vars.colors.$red20,
      },
      '&.active': {
        backgroundColor: vars.colors.$pink80,
      },
      '&.active:hover': {
        color: vars.colors.$pink40,
      },
    },
  },
]);

export const gridMiniMenuListItemStyle = style([
  {
    borderBottom: `1px solid ${vars.colors.$gray40}`,
  },
]);

export const gridMiniMenuListStyle = style([
  sprinkles({
    padding: 0,
    margin: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const gridItemMenuStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
    padding: '$6',
    paddingTop: '$4',
    width: '$64',
  }),
]);

export const subMenuTitleClass = style([
  sprinkles({
    color: '$foreground',
    fontSize: '$md',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '$4',
    paddingBottom: '$4',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);
