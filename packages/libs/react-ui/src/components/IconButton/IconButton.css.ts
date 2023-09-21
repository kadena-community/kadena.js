import type { ColorType } from '@theme';
import { sprinkles, vars } from '@theme';
import { style, styleVariants } from '@vanilla-extract/css';

const container = style([
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
    transition: 'opacity, outline .2s ease',
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

type ColorOptions = ColorType | 'default' | 'inverted';

const colors: Record<ColorOptions, ColorOptions> = {
  default: 'default',
  inverted: 'inverted',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  if (color === 'default') {
    return [container, sprinkles({ color: '$neutral5', bg: 'transparent' })];
  }

  if (color === 'inverted') {
    return [container, sprinkles({ color: '$neutral2', bg: 'transparent' })];
  }

  return [
    container,
    sprinkles({
      color: `$${color}Contrast`,
      bg: `$${color}Surface`,
    }),
    {
      outlineOffset: '2px',
      outline: `2px solid ${vars.colors[`$${color}Accent`]}`,
    },
  ];
});

export const nonActiveClass = style({
  outline: 'none',
});
