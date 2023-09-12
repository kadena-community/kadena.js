import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

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

export const positiveActiveIconClass = style({
  outlineOffset: '2px',
  outlineColor: vars.colors.$green60,
});

export const negativeActiveIconClass = style({
  outlineOffset: '2px',
  outlineColor: vars.colors.$red60,
});

export type ColorOptions = ColorType | 'default' | 'inverted';

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
    sprinkles({ color: `$${color}Contrast`, bg: `$${color}Surface` }),
  ];
});

export const stateVariants = styleVariants({
  positive: [
    {
      outlineOffset: '2px',
      outline: `2px solid ${vars.colors.$green60}`,
    },
  ],
  negative: [
    {
      outlineOffset: '2px',
      outline: `2px solid ${vars.colors.$red60}`,
    },
  ],
});
