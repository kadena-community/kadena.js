import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const sidebarClass = style([
  sprinkles({
    position: 'fixed',
    left: 0,
    top: '$16',
    bottom: 0,
    backgroundColor: '$neutral1',
    display: 'flex',
    zIndex: 1,
  }),
  {
    borderRight: `1px solid ${vars.colors.$borderSubtle}`,
  },
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
    transition: 'width 0.1s ease',
    width: '100%',
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$white,
      },
      [`&:hover`]: {
        color: vars.colors.$blue60,
      },
      [`${darkThemeClass} &.active`]: {
        color: vars.colors.$blue40,
      },
      [`&.active`]: {
        color: vars.colors.$blue80,
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
    fontWeight: '$bold',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$white,
      },
      [`&:hover`]: {
        color: vars.colors.$blue60,
      },
      [`${darkThemeClass} &.active`]: {
        color: vars.colors.$blue40,
      },
      [`&.active`]: {
        color: vars.colors.$blue80,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: vars.colors.$blue20,
      },
      ['&.active:hover']: {
        color: vars.colors.$blue60,
      },
      '&:last-child': {
        marginBottom: 0,
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
    position: 'absolute',
    bottom: 0,
  }),
  {
    borderTop: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const gridItemMenuStyle = style([
  {
    width: `calc(${vars.sizes.$64} + ${vars.sizes.$6})`,
  },
]);

export const subMenuTitleClass = style([
  sprinkles({
    fontSize: '$md',
    fontWeight: '$bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingX: '$4',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
    padding: '0.625rem 1rem',
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

export const subMenuContentStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
  }),
  {
    height: '-webkit-fill-available',
  },
]);
