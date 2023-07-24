import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const gridItemMiniMenuStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
  }),
  {
    gridArea: 'mini-menu',
  },
]);

export const gridMiniMenuListButtonStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '$foreground',
    padding: '$5',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    selectors: {
      '&:hover': {
        color: vars.colors.$secondaryHighContrast,
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
      '&.active': {
        backgroundColor: vars.colors.$secondarySurface,
      },
    },
  },
]);

export const gridMiniMenuListItemStyle = style([
  {
    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
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
  }),
  {
    gridArea: 'menu',
  },
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
