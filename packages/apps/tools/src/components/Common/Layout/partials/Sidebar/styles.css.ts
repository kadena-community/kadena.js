import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/styles';
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
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`${darkThemeClass} &.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n40,
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
    borderBottom: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    padding: '0.85rem 1rem',

    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
      [`${darkThemeClass} &.active`]: {
        color: tokens.kda.foundation.color.palette.blue.n40,
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
    borderBottom: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
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
    borderTop: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);

export const gridItemMenuStyle = style([
  {
    borderLeft: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
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
    borderBottom: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
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
    backgroundColor: 'layer-2.default',
  }),
]);
