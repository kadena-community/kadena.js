import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const gridItemMiniMenuStyle = style([
  {
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
]);

export const gridMiniMenuListButtonStyle = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 'md',
  }),
  {
    color: tokens.kda.foundation.color.neutral.n50,
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`${darkThemeClass} &.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`&.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n80,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n20,
      },
      ['&.active:hover']: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
    },
  },
]);

export const gridMiniMenuLinkButtonStyle = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 'bodyFont.bold',
    fontSize: 'sm',
    pointerEvents: 'none',
  }),
  {
    width: '100%',
    borderBottom: `1px solid #E3E1E5`,
    padding: '0.85rem 1rem',

    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`${darkThemeClass} &.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`&.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n80,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n20,
      },
      ['&.active:hover']: {
        color: tokens.kda.foundation.color.palette.blue.n60,
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
  {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
]);

export const bottomIconsContainerStyle = style([
  atoms({
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
  atoms({
    fontSize: 'sm',
    fontWeight: 'bodyFont.bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingInlineStart: 'md',
  }),
  {
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
  atoms({
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
