import { ColorType, sprinkles, vars } from '../../styles';

import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const elementVariant = {
  h1: [
    sprinkles({
      fontWeight: 'bold',
      fontSize: {
        xs: '5xl',
        md: '7xl',
        lg: '9xl',
        xl: '10xl',
        '2xl': '12xl',
      },
    }),
  ],
  h2: [
    sprinkles({
      fontWeight: 'bold',
      fontSize: {
        xs: '4xl',
        lg: '6xl',
        xl: '8xl',
        '2xl': '9xl',
      },
    }),
  ],
  h3: [
    sprinkles({
      fontWeight: 'semiBold',
      fontSize: {
        xs: '2xl',
        lg: '4xl',
        xl: '5xl',
        '2xl': '6xl',
      },
    }),
  ],
  h4: [
    sprinkles({
      fontWeight: 'semiBold',
      fontSize: {
        xs: 'xl',
        lg: '2xl',
        xl: '3xl',
        '2xl': '4xl',
      },
    }),
  ],
  h5: [
    sprinkles({
      fontWeight: 'semiBold',
      fontSize: {
        xs: 'lg',
        xl: 'xl',
        '2xl': '4xl',
      },
    }),
  ],
  h6: [
    sprinkles({
      fontWeight: 'semiBold',
      fontSize: {
        xs: 'base',
        xl: 'md',
        '2xl': 'lg',
      },
    }),
  ],
  p: [sprinkles({ fontWeight: 'normal' })],
  span: [sprinkles({ fontWeight: 'normal' })],
  code: [sprinkles({ fontWeight: 'normal' })],
  label: [sprinkles({ fontWeight: 'medium' })],
};

export const fontVariant = {
  main: [sprinkles({ fontFamily: 'main' })],
  mono: [sprinkles({ fontFamily: 'mono' })],
};

export const boldVariant = {
  true: [sprinkles({ fontWeight: 'semiBold' })],
  false: [],
};

export const transformVariant = {
  uppercase: [sprinkles({ textTransform: 'uppercase' })],
  lowercase: [sprinkles({ textTransform: 'lowercase' })],
  capitalize: [sprinkles({ textTransform: 'capitalize' })],
  none: [sprinkles({ textTransform: 'none' })],
};

export const colorVariant = {
  default: [sprinkles({ color: 'neutral4' })],
  emphasize: [sprinkles({ color: 'neutral6' })],
};

export const baseText = recipe({
  variants: {
    variant: elementVariant,
    font: fontVariant,
    bold: boldVariant,
    transform: transformVariant,
    color: colorVariant,
  },

  compoundVariants: [
    {
      variants: {
        variant: 'h1',
        bold: true,
      },
      style: [sprinkles({ fontWeight: 'bold' })],
    },
    {
      variants: {
        font: 'main',
        variant: 'h1',
        bold: false,
      },
      style: [sprinkles({ fontWeight: 'light' })],
    },
    {
      variants: {
        variant: 'h2',
        bold: true,
      },
      style: [sprinkles({ fontWeight: 'bold' })],
    },
    {
      variants: {
        font: 'main',
        variant: 'h2',
        bold: false,
      },
      style: [sprinkles({ fontWeight: 'light' })],
    },
  ],

  defaultVariants: {
    variant: 'span',
    font: 'main',
    bold: false,
    color: 'default',
    transform: 'none',
  },
});

export type BaseTextVariants = RecipeVariants<typeof baseText>;
