import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  sprinkles({
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '$16',
  }),
]);

export const gridItemMainStyle = style([
  sprinkles({
    paddingTop: '$20',
    paddingBottom: '$16',
    paddingRight: '$6',
  }),
  {
    paddingLeft: `calc(${vars.sizes.$20} + ${vars.sizes.$2})`,
    selectors: {
      '&.isMenuOpen': {
        paddingLeft: `calc(${vars.sizes.$64} + ${vars.sizes.$20} + ${vars.sizes.$6})`,
      },
    },
  },
]);

export const footerStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
    width: '100%',
    bottom: 0,
    position: 'fixed',
    height: '$10',
  }),
]);

export const rightPanelStyle = style([
  sprinkles({
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
]);

export const rightPanelColsStyle = style([
  sprinkles({
    paddingRight: '$2',
    paddingLeft: '$2',
  }),
]);
