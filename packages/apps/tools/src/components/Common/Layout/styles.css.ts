import { atoms, darkThemeClass, vars } from '@kadena/react-ui/theme';
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
    height: vars.sizes.$16,
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
    paddingTop: vars.sizes.$20,
    paddingRight: vars.sizes.$6,
    paddingLeft: `calc(${vars.sizes.$20} + ${vars.sizes.$2})`,
    borderRight: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderRight: `1px solid #27232999`,
      },

      '&.isMenuOpen': {
        paddingLeft: `calc(${vars.sizes.$64} + ${vars.sizes.$20} + ${vars.sizes.$2})`,
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
    width: vars.sizes.$12,
    top: vars.sizes.$16,
    backgroundColor: vars.colors.$neutral1,
    transition: 'width 0.1s ease-in',
    borderRight: `1px solid #E3E1E5`,
    selectors: {
      '&.isMenuOpen': {
        width: `calc(${vars.sizes.$64} + ${vars.sizes.$10})`,
      },
      [`${darkThemeClass} &`]: {
        borderRight: `1px solid #27232999`,
      },
    },
  },
]);
