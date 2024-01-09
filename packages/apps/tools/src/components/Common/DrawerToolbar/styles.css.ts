import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const gridItemCollapsedSidebarStyle = style([
  sprinkles({
    position: 'fixed',
    right: '$12',
    top: '$16',
    bottom: 0,
    backgroundColor: '$neutral1',
    width: '$12',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '$sm',
    zIndex: 1,
  }),
  {
    height: '100vh',
    borderLeft: `solid 1px ${vars.colors.$borderSubtle}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${vars.sizes.$64} + ${vars.sizes.$20})`,
      },
    },
  },
]);

export const gridItemMiniMenuStyle = style([
  {

    flexDirection: 'column',
    position: 'relative',
  },
  {
    height: '100%',
    borderLeft: `solid 1px ${vars.colors.$borderSubtle}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${vars.sizes.$64} + ${vars.sizes.$35})`,
      },
    },
  },
]);

export const buttonWrapperClass = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }),
  {
    borderBottom: `solid 1px ${vars.colors.$borderSubtle}`,
  },
]);

export const expandedDrawerTitleClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '$bold',
  }),
  {
    borderBottom: `1px solid #E3E1E5`,
    padding: '0.125rem 0.75rem',
    paddingLeft: '1.25rem',
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
    },
  },
]);

export const expandedDrawerContentClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    overflowY: 'auto',
    height: `calc(100% - ${vars.sizes.$20})`,
  },
]);

export const expandedDrawerContentStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    right: 0,
    top: '$16',
    bottom: 0,
    backgroundColor: '$neutral1',
    width: '$12',
    fontSize: '$sm',
    zIndex: 1,
  }),
  {
    overflowY: 'auto',
  },
]);
