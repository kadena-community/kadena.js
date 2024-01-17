import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const gridItemCollapsedSidebarStyle = style([
  atoms({
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'sm',
    zIndex: 1,
  }),
  {
    width: tokens.kda.foundation.size.n12,
    right: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    height: '100vh',
    backgroundColor: tokens.kda.foundation.color.neutral.n1,
    borderLeft: `solid 1px ${tokens.kda.foundation.color.border.base}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n12})`,
      },
    },
  },
]);

export const gridItemMiniMenuStyle = style([
  atoms({
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  }),
  {
    borderLeft: `1px solid #E3E1E5`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n20})`,
      },
      [`${darkThemeClass} &`]: {
        borderLeft: `1px solid #27232999`,
      },
    },
  },
]);

export const buttonWrapperClass = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
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

export const expandedDrawerTitleClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
  }),
  {
    borderBottom: `1px solid #E3E1E5`,
    paddingLeft: '1.25rem',
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
    },
  },
]);

export const expandedDrawerContentClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    overflowY: 'auto',
    height: `calc(100% - ${tokens.kda.foundation.size.n20})`,
  },
]);

export const expandedDrawerContentStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    right: 0,
    bottom: 0,
    fontSize: 'sm',
    zIndex: 1,
  }),
  {
    width: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    height: '100vh',
    backgroundColor: tokens.kda.foundation.color.neutral.n1,
    overflowY: 'auto',
  },
]);
