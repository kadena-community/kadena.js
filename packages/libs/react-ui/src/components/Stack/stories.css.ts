import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const itemClass = style([
  sprinkles({
    borderRadius: '$sm',
    backgroundColor: '$primarySurface',
    padding: '$6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
]);

export const itemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    {
      width: size,
      height: size,
    },
  ];
});

export const containerClass = style([
  sprinkles({
    backgroundColor: 'transparent',
    borderColor: '$primaryAccent',
    borderStyle: 'solid',
    borderWidth: '$sm',
  }),
]);

export const stackClass = style([
  sprinkles({
    backgroundColor: '$primaryContrast',
  }),
]);
