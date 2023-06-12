import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const item = style([
  sprinkles({
    borderRadius: 'sm',
    backgroundColor: 'primarySurface',
    color: 'neutral6',
    size: 32,
  }),
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const itemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    item,
    {
      width: size,
      height: size,
    },
  ];
});
