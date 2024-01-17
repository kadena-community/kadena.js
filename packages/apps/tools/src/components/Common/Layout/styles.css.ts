import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  atoms({
    position: 'fixed',
    top: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  }),
  {
    height: tokens.kda.foundation.size.n16,
  },
]);

export const mainStyle = style([
  atoms({
    width: '100%',
  }),
  {
    height: '100vh',
    backgroundColor: '#E3E1E5',
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: '#272329',
      },
    },
  },
]);

export const gridItemMainStyle = style([
  atoms({
    width: '100%',
    overflowY: 'scroll',
  }),
  {
    height: '100vh',
    paddingTop: tokens.kda.foundation.size.n20,
    paddingInline: `calc(${tokens.kda.foundation.size.n20} + ${tokens.kda.foundation.size.n2})`,
    borderRight: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderRight: `1px solid #27232999`,
      },

      '&.isMenuOpen': {
        paddingLeft: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n20} + ${tokens.kda.foundation.size.n2})`,
      },
      [`${darkThemeClass} &.isMenuOpen`]: {
        borderRight: `1px solid #27232999`,
      },
    },
  },
]);

export const sidebarStyle = style([
  atoms({
    position: 'fixed',
    left: 0,
    bottom: 0,
    display: 'flex',
    overflow: 'hidden',
    zIndex: 1,
  }),
  {
    width: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    backgroundColor: tokens.kda.foundation.color.neutral.n1,
    transition: 'width 0.1s ease-in',
    borderRight: `1px solid #E3E1E5`,
    selectors: {
      '&.isMenuOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n10})`,
      },
      [`${darkThemeClass} &`]: {
        borderRight: `1px solid #27232999`,
      },
    },
  },
]);
