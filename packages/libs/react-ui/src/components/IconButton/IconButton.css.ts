import { ColorType, sprinkles, vars } from '../../styles';

import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const contrastColor = createVar(),
  surfaceColor = createVar();

export const container = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$lg',
    cursor: 'pointer',
    size: '$11',
    border: 'none',
  }),
  {
    transition: 'opacity .2s ease',
    color: fallbackVar(contrastColor, vars.colors.$neutral5),
    backgroundColor: fallbackVar(surfaceColor, 'transparent'),
    selectors: {
      '&:hover': {
        opacity: '.6',
      },
      '&:focus-visible': {
        outlineOffset: '2px',
        outline: `2px solid ${vars.colors.$neutral5}`,
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
    container,
    {
      vars: {
        [contrastColor]: vars.colors[`$${color}Contrast`],
        [surfaceColor]: vars.colors[`$${color}Surface`],
      },
    },
  ];
});

export const invertedVariant = style([
  container,
  {
    vars: {
      [contrastColor]: vars.colors.$neutral3,
      [surfaceColor]: 'transparent',
    },
  },
]);
