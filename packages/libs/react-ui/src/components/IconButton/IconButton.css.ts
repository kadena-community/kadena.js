import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import { createVar, style, styleVariants } from '@vanilla-extract/css';

const backgroundColorHover = createVar(),
  backgroundColorActive = createVar(),
  colorHover = createVar(),
  outlineColorFocus = createVar();

export const activeClass = style({
  outlineOffset: '2px',
  outlineWidth: vars.borderWidths.$md,
  outlineStyle: 'solid',
  outlineColor: outlineColorFocus,
});

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
    ':hover': {
      color: colorHover,
      backgroundColor: backgroundColorHover,
    },
    ':active': {
      outlineOffset: '2px',
      outlineWidth: vars.borderWidths.$md,
      outlineStyle: 'solid',
      outlineColor: outlineColorFocus,
    },
    ':focus-visible': {
      outlineOffset: '2px',
      outlineWidth: vars.borderWidths.$md,
      outlineStyle: 'solid',
      outlineColor: outlineColorFocus,
    },
    ':disabled': {
      opacity: 0.7,
      backgroundColor: colorPalette.$gray60,
      color: colorPalette.$gray10,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    transition:
      'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
  },
]);

export const colorVariants: Omit<
  Record<ColorType, ColorType>,
  'info' | 'tertiary'
> = {
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const typeVariants: {
  default: 'default';
  compact: 'compact';
  alternative: 'alternative';
} = {
  default: 'default',
  compact: 'compact',
  alternative: 'alternative',
};

export const defaultVariant = styleVariants(colorVariants, (variant) => {
  return [
    container,
    sprinkles({
      bg: `$${variant}Surface`,
      color: `$${variant}Contrast`,
    }),
    {
      vars: {
        [colorHover]: vars.colors[`$${variant}Contrast`],
        [backgroundColorHover]: vars.colors[`$${variant}HighContrast`],
        [backgroundColorActive]: vars.colors[`$${variant}HighContrast`],
        [outlineColorFocus]: vars.colors[`$${variant}Accent`],
      },
    },
  ];
});

export const compactVariant = styleVariants(colorVariants, (variant) => {
  return [
    container,
    sprinkles({
      background: 'none',
      color: `$${variant}ContrastInverted`,
    }),
    {
      padding: `${vars.sizes.$1} ${vars.sizes.$1}`,
      vars: {
        [colorHover]: vars.colors[`$${variant}ContrastInverted`],
        [backgroundColorHover]: 'none',
        [backgroundColorActive]: vars.colors[`$${variant}HighContrast`],
        [outlineColorFocus]: vars.colors[`$${variant}Accent`],
      },
    },
  ];
});

export const alternativeVariant = styleVariants(colorVariants, (variant) => {
  return [
    container,
    sprinkles({
      bg: `$${variant}LowContrast`,
      color: `$${variant}ContrastInverted`,
    }),
    {
      vars: {
        [colorHover]: vars.colors[`$${variant}ContrastInverted`],
        [backgroundColorHover]: vars.colors[`$${variant}SurfaceInverted`],
        [backgroundColorActive]: vars.colors[`$${variant}HighContrast`],
        [outlineColorFocus]: vars.colors[`$${variant}Accent`],
      },
    },
  ];
});
