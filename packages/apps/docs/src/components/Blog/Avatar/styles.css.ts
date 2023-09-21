import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const avatarClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '$primaryContrastInverted',
    color: '$primarySurfaceInverted',
    fontWeight: '$bold',
    fontSize: '$md',
  }),
  {
    borderRadius: '50%',
  },
]);

export const avatarSizeVariant = styleVariants({
  default: {
    width: vars.sizes.$10,
    height: vars.sizes.$10,
  },
  large: {
    width: vars.sizes.$15,
    height: vars.sizes.$15,
  },
});
