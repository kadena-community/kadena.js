import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const showOnMobileClass = style([
  sprinkles({
    display: {
      sm: 'block',
      md: 'none',
    },
  }),
]);

export const linkClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: '$neutral4',
    fontWeight: '$semiBold',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&::after': {
        position: 'absolute',
        right: vars.sizes.$2,
        content: '',
        width: vars.sizes.$2,
        height: vars.sizes.$2,
        borderRight: `2px solid ${vars.colors.$neutral4}`,
        borderTop: `2px solid ${vars.colors.$neutral4}`,
        opacity: 0,
        transform: `rotate(45deg) translate(-${vars.sizes.$1}, ${vars.sizes.$1})`,
        transition: 'transform .2s ease ',
      },
      '&:hover': {
        color: vars.colors.$primaryContrast,
      },
      '&:hover::after': {
        opacity: 1,
        transform: 'rotate(45deg) translate(0, 0)',
      },
    },
  },
]);
