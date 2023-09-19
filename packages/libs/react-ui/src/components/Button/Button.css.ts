import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import {
  createVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const bgHoverColor = createVar(),
  bgActiveColor = createVar(),
  focusOutlineColor = createVar();

export const container = style([
  sprinkles({
    border: 'none',
    borderRadius: '$sm',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '$base',
    fontWeight: '$semiBold',
    gap: '$2',
    lineHeight: '$normal',
    paddingX: '$4',
    paddingY: '$3',
    placeItems: 'center',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&[href]': {
        display: 'inline-flex',
      },
      // [`${darkThemeClass} &:hover`]: {
      //   color: colorPalette.$gray100,
      //   backgroundColor: colorPalette.$blue30,
      // },
    },
    ':hover': {
      backgroundColor: bgHoverColor,
      // color: vars.colors.$blue20,
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
      backgroundColor: colorPalette.$gray60,
      color: colorPalette.$gray10,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  },
]);

const variants: Omit<Record<ColorType, ColorType>, 'info' | 'tertiary'> = {
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(variants, (variant) => {
  return [
    container,
    sprinkles({
      bg: `$${variant}Surface`,
      color: `$${variant}Contrast`,
    }),
    {
      vars: {
        [bgHoverColor]: vars.colors[`$${variant}HighContrast`],
        [bgActiveColor]: vars.colors[`$${variant}HighContrast`],
        [focusOutlineColor]: vars.colors[`$${variant}Accent`],
      },
    },
  ];
});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const buttonLoadingClass = style({
  pointerEvents: 'none',
});

export const iconLoadingClass = style({
  animationName: rotate,
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
});
