/* eslint @typescript-eslint/naming-convention: 0, @kadena-dev/typedef-var: 0 */

import { sprinkles } from '../../../styles';
import {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const elementVariants = {
  h1: [
    sprinkles({
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
      fontSize: {
        xs: 'lg',
        xl: 'xl',
        '2xl': '4xl',
      },
    }),
  ],
  h6: [
    sprinkles({
      fontSize: {
        xs: 'base',
        xl: 'md',
        '2xl': 'lg',
      },
    }),
  ],
};

export const boldVariants = {
  true: [sprinkles({ fontWeight: 'semiBold' })],
  false: [sprinkles({ fontWeight: 'normal' })],
};

export const heading = recipe({
  variants: {
    variant: elementVariants,
    font: fontVariants,
    bold: boldVariants,
    transform: transformVariants,
    color: colorVariants,
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
    variant: 'h1',
    font: 'main',
    bold: false,
    color: 'default',
    transform: 'none',
  },
});

export type BaseTextVariants = RecipeVariants<typeof heading>;
