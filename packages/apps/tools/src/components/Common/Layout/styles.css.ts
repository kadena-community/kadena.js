import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  sprinkles({
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '$16',
    alignItems: 'center',
    overflow: 'auto',
    zIndex: 1,
  }),
]);

export const mainStyle = style([
  sprinkles({
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
  sprinkles({
    paddingTop: '$20',
    paddingBottom: '$16',
    paddingRight: '$6',
  }),
  {
    width: 'auto',
    height: '100%',
    overflowY: 'scroll',
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
  sprinkles({
    position: 'fixed',
    left: 0,
    top: '$16',
    bottom: 0,
    backgroundColor: '$neutral1',
    display: 'flex',
    overflow: 'hidden',
    zIndex: 1,
    width: '$12',
  }),
  {
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
