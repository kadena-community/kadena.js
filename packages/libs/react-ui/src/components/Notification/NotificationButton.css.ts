import { ColorType, sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
  }),
  {
    selectors: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
]);

const colors: Record<ColorType, ColorType> = {
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  return [
    containerClass,
    sprinkles({
      color: `$${color}Contrast`,
    }),
  ];
});

export const iconStandaloneContainerClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
]);

export const iconContainerClass = style([
  iconStandaloneContainerClass,
  sprinkles({
    marginX: '$sm',
  }),
]);
