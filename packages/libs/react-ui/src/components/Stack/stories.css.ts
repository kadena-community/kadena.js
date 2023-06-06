import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const Item = style([
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

export const ItemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    Item,
    {
      width: size,
      height: size,
    },
  ];
});
