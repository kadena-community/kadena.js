import { ColorType, Sprinkles, sprinkles, vars } from '../../styles';

import { createVar, style, styleVariants } from '@vanilla-extract/css';

const bgHoverColor = createVar(),
  bgActiveColor = createVar(),
  focusOutlineColor = createVar();

export const container = style([
  sprinkles({
    display: 'flex',
    placeItems: 'center',
    gap: 1,
    borderRadius: 'sm',
    cursor: 'pointer',
    paddingX: 4,
    paddingY: 3,
    border: 'none',
    fontSize: 'base',
  }),
  {
    transition: 'background-color 0.4s ease',
    ':hover': {
      background: bgHoverColor,
    },
    ':active': {
      background: bgActiveColor,
    },
    ':focus-visible': {
      outlineOffset: '2px',
      outlineWidth: vars.borderWidths.md,
      outlineStyle: 'solid',
      outlineColor: focusOutlineColor,
    },
    ':disabled': {
      opacity: 0.7,
      background: vars.colors.neutral3,
      color: vars.colors.neutral1,
      cursor: 'not-allowed',
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
    sprinkles({
      color: `${color}Surface` as Sprinkles['color'],
      bg: `${color}Contrast` as Sprinkles['color'],
    }),
    {
      vars: {
        [bgHoverColor]: vars.colors[`${color}HighContrast`],
        [bgActiveColor]: vars.colors[`${color}Accent`],
        [focusOutlineColor]: vars.colors[`${color}Accent`],
      },
    },
  ];
});
