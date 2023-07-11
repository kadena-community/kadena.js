import { sprinkles } from '@theme/sprinkles.css';
import { ColorType, vars } from '@theme/vars.css';
import { createVar, style, styleVariants } from '@vanilla-extract/css';

const bgHoverColor = createVar(),
  bgActiveColor = createVar(),
  focusOutlineColor = createVar();

export const container = style([
  sprinkles({
    display: 'flex',
    placeItems: 'center',
    gap: '$2',
    borderRadius: '$sm',
    cursor: 'pointer',
    paddingX: '$4',
    paddingY: '$3',
    border: 'none',
    fontSize: '$base',
    textDecoration: 'none',
    lineHeight: '$normal',
  }),
  {
    selectors: {
      '&[href]': {
        display: 'inline-block',
      },
    },
    transition: 'background-color 0.4s ease',
    ':hover': {
      backgroundColor: bgHoverColor,
    },
    ':active': {
      backgroundColor: bgActiveColor,
    },
    ':focus-visible': {
      outlineOffset: '2px',
      outlineWidth: vars.borderWidths.$md,
      outlineStyle: 'solid',
      outlineColor: focusOutlineColor,
    },
    ':disabled': {
      opacity: 0.7,
      backgroundColor: vars.colors.$neutral3,
      color: vars.colors.$neutral1,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
]);

const colors: Record<ColorType, ColorType> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  return [
    container,
    sprinkles({
      color: `$${color}Surface`,
      bg: `$${color}Contrast`,
    }),
    {
      vars: {
        [bgHoverColor]: vars.colors[`$${color}HighContrast`],
        [bgActiveColor]: vars.colors[`$${color}Accent`],
        [focusOutlineColor]: vars.colors[`$${color}Accent`],
      },
    },
  ];
});
