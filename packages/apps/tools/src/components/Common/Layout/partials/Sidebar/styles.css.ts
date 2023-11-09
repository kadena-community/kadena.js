import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const gridItemMiniMenuStyle = style([
  {
    height: '100%',
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
    padding: '$4',
    color: '$gray50',
  }),
  {
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
    width: '100%',
    borderBottom: `1px solid #E3E1E5`,

    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
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
    borderBottom: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
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

export const bottomIconsContainerStyle = style([
  sprinkles({
    position: 'absolute',
    bottom: 0,
  }),
  {
    borderTop: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderTop: `1px solid #27232999`,
      },
    },
  },
]);

export const gridItemMenuStyle = style([
  {
    borderLeft: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderLeft: `1px solid #27232999`,
      },
    },
  },
]);

export const subMenuTitleClass = style([
  sprinkles({
    fontSize: '$md',
    fontWeight: '$bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingX: '$3',
  }),
  {
    padding: '0.125rem 1rem',
    borderBottom: `1px solid #E3E1E5`,

    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
    },
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
    height: '100%',
  }),
  {
    backgroundColor: '#F5F2F7',
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: '#171519',
      },
    },
  },
]);
