/* eslint @typescript-eslint/naming-convention: 0, @kadena-dev/typedef-var: 0 */

import {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { sprinkles } from '@theme/sprinkles.css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';

export const elementVariants = {
  h1: [
    sprinkles({
      fontSize: {
        xs: '$5xl',
        md: '$7xl',
        lg: '$9xl',
        xl: '$10xl',
        xxl: '$12xl',
      },
    }),
  ],
  h2: [
    sprinkles({
      fontWeight: '$bold',
      fontSize: {
        xs: '$4xl',
        lg: '$6xl',
        xl: '$8xl',
        xxl: '$9xl',
      },
    }),
  ],
  h3: [
    sprinkles({
      fontSize: {
        xs: '$2xl',
        lg: '$4xl',
        xl: '$5xl',
        xxl: '$6xl',
      },
    }),
  ],
  h4: [
    sprinkles({
      fontSize: {
        xs: '$xl',
        lg: '$2xl',
        xl: '$3xl',
        xxl: '$4xl',
      },
    }),
  ],
  h5: [
    sprinkles({
      fontSize: {
        xs: '$lg',
        xl: '$xl',
        xxl: '$4xl',
      },
    }),
  ],
  h6: [
    sprinkles({
      fontSize: {
        xs: '$base',
        xl: '$md',
        xxl: '$lg',
      },
    }),
  ],
};

export const boldVariants = {
  true: [sprinkles({ fontWeight: '$semiBold' })],
  false: [sprinkles({ fontWeight: '$normal' })],
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
      style: [sprinkles({ fontWeight: '$bold' })],
    },
    {
      variants: {
        font: 'main',
        variant: 'h1',
        bold: false,
      },
      style: [sprinkles({ fontWeight: '$light' })],
    },
    {
      variants: {
        variant: 'h2',
        bold: true,
      },
      style: [sprinkles({ fontWeight: '$bold' })],
    },
    {
      variants: {
        font: 'main',
        variant: 'h2',
        bold: false,
      },
      style: [sprinkles({ fontWeight: '$light' })],
    },
  ],

  defaultVariants: {
    variant: 'h1',
    font: 'main',
    bold: true,
    color: 'default',
    transform: 'none',
  },
});

export type BaseTextVariants = RecipeVariants<typeof heading>;
