/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { styled } from '../../styles/stitches.config';

export const fontVariant = {
  main: {
    fontFamily: '$main',
  },
  mono: {
    fontFamily: '$mono',
  },
} as const;

export const asVariant = {
  h1: { $$boldWeight: '$fontWeights$bold' },
  h2: { $$boldWeight: '$fontWeights$bold' },
  h3: { $$boldWeight: '$fontWeights$semiBold' },
  h4: { $$boldWeight: '$fontWeights$semiBold' },
  h5: { $$boldWeight: '$fontWeights$semiBold' },
  h6: { $$boldWeight: '$fontWeights$semiBold' },
  p: { $$boldWeight: '$fontWeights$medium' },
  span: { $$boldWeight: '$fontWeights$medium' },
  code: { $$boldWeight: '$fontWeights$medium' },
} as const;

export const boldVariant = {
  true: {
    fontWeight: '$$boldWeight',
  },
  false: {
    fontWeight: '$regular',
  },
} as const;

export const textSizeVariant = {
  sm: {
    fontSize: '$xs',
  },
  md: {
    fontSize: '$sm',
  },
  lg: {
    fontSize: '$base',
  },
};

export const BaseText = styled('span', {
  fontWeight: '$regular',
  $$boldWeight: '$bold',

  variants: {
    as: asVariant,
    font: fontVariant,
    bold: boldVariant,
  },

  defaultVariants: {
    as: 'span',
    font: 'main',
    bold: 'false',
  },

  compoundVariants: [
    {
      font: 'main',
      bold: false,
      as: 'h1',
      css: {
        fontWeight: '$light',
      },
    },
    {
      font: 'main',
      bold: false,
      as: 'h2',
      css: {
        fontWeight: '$light',
      },
    },
  ],
});

export const Text = styled(BaseText, {
  variants: {
    size: textSizeVariant,
  },

  defaultVariants: {
    size: 'lg',
  },
});
