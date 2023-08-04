import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import { ColorType, darkThemeClass, vars } from '@theme/vars.css';
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
    color: {
      lightMode: '$white',
      darkMode: '$gray80',
    },
    backgroundColor: {
      darkMode: '$blue50',
    },
  }),
  {
    selectors: {
      '&[href]': {
        display: 'inline-flex',
      },
      '&:hover': {
        backgroundColor: bgHoverColor,
        color: colorPalette.$white,
      },
      '&:active': {
        backgroundColor: bgActiveColor,
      },
      '&:focus-visible': {
        outlineOffset: '2px',
        outlineWidth: vars.borderWidths.$md,
        outlineStyle: 'solid',
        outlineColor: focusOutlineColor,
      },
      '&:disabled': {
        opacity: 0.7,
        backgroundColor: colorPalette.$gray60,
        color: colorPalette.$gray10,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      [`${darkThemeClass} &:hover`]: {
        color: colorPalette.$gray100,
        backgroundColor: colorPalette.$blue30,
      },
    },
    transition: 'background-color 0.4s ease',
  },
]);

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

const variants: Record<ColorType, ColorType> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(variants, (variant) => {
  return [
    container,
    sprinkles({
      color: `$${variant}Surface`,
      bg: `$${variant}Contrast`,
    }),
    {
      vars: {
        [bgHoverColor]: vars.colors[`$${variant}HighContrast`],
        [bgActiveColor]: vars.colors[`$${variant}Accent`],
        [focusOutlineColor]: vars.colors[`$${variant}Accent`],
      },
    },
  ];
});
