import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const sidebarClass = style([
  sprinkles({
    position: 'fixed',
    left: 0,
    top: '$16',
    bottom: '$10',
    backgroundColor: '$neutral1',
    display: 'flex',
  }),
]);

export const gridItemMiniMenuStyle = style([
  {
    height: '100%',
    borderRight: `1px solid ${vars.colors.$borderSubtle}`,
    flexDirection: 'column',
    position: 'relative',
  },
]);

export const gridMiniMenuListButtonStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '$5',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$blue60,
      },
      [`&:hover`]: {
        color: vars.colors.$blue60,
      },
      [`${darkThemeClass} &.active`]: {
        backgroundColor: vars.colors.$blue80,
      },
      [`&.active`]: {
        backgroundColor: vars.colors.$blue20,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: vars.colors.$blue20,
      },
      ['&.active:hover']: {
        color: vars.colors.$blue60,
      },
    },
  },
]);

export const gridMiniMenuLinkButtonStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '$5',
    textAlign: 'left',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$blue60,
      },
      [`&:hover`]: {
        color: vars.colors.$blue60,
      },
      [`${darkThemeClass} &.active`]: {
        backgroundColor: vars.colors.$blue80,
      },
      [`&.active`]: {
        backgroundColor: vars.colors.$blue20,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: vars.colors.$blue20,
      },
      ['&.active:hover']: {
        color: vars.colors.$blue60,
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

export const bottomIconsContainerStyle = style([
  sprinkles({
    padding: 0,
    margin: 0,
    position: 'absolute',
    bottom: 0,
  }),
  {
    borderTop: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const gridItemMenuStyle = style([
  sprinkles({
    padding: '$6',
    paddingTop: '$4',
  }),
  {
    width: `calc(${vars.sizes.$64} + ${vars.sizes.$6})`,
  },
]);

export const subMenuTitleClass = style([
  sprinkles({
    color: '$gray10',
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

export const iconLeftStyle = style([
  {
    transform: 'rotate(270deg)',
  },
]);

export const iconRightStyle = style([
  {
    transform: 'rotate(90deg)',
  },
]);
