import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  sprinkles({
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '$16',
    alignItems: 'center',
  }),
]);

export const gridItemMainStyle = style([
  sprinkles({
    paddingTop: '$20',
    paddingBottom: '$16',
    paddingRight: '$6',
  }),
  {
    width: '680px',
    paddingLeft: `calc(${vars.sizes.$20} + ${vars.sizes.$2})`,
    selectors: {
      '&.isMenuOpen': {
        width: `calc(${vars.sizes.$20} + ${vars.sizes.$2}) + 680px`,
        paddingLeft: `calc(${vars.sizes.$64} + ${vars.sizes.$20} + ${vars.sizes.$6})`,
        borderRight: `1px solid ${vars.colors.$borderSubtle}`,
      },
    },
  },
]);
