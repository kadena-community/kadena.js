import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const gridItemMiniMenuStyle = style([
  sprinkles({
    backgroundColor: '$neutral5',
  }),
  {
    gridArea: 'mini-menu',
    borderRight: `1px solid ${vars.colors.$borderSubtle}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$neutral2,
      },
    },
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
        color: vars.colors.$negativeSurface,
      },
      '&.active': {
        backgroundColor: vars.colors.$secondaryContrast,
      },
      '&.active:hover': {
        color: vars.colors.$secondarySurface,
      },

      [`${darkThemeClass} &`]: {
        color: vars.colors.$neutral5,
      },
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$white,
      },
      [`${darkThemeClass} &:active`]: {
        color: vars.colors.$negativeContrast,
      },
      [`${darkThemeClass} &.active`]: {
        backgroundColor: vars.colors.$secondarySurface,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: vars.colors.$secondaryHighContrast,
      },
    },
  },
]);

export const gridMiniMenuListItemStyle = style([
  {
    borderBottom: `1px solid ${vars.colors.$borderContrast}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
      },
    },
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
