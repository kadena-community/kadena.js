import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const itemClass = style([
  sprinkles({
    borderRadius: '$sm',
    backgroundColor: '$primarySurface',
    color: '$neutral6',
    size: '$32',
  }),
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const itemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    {
      width: size,
      height: size,
    },
  ];
});
