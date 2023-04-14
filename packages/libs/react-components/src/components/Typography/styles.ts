/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { styled } from '../../styles/stitches.config';

export const elementVariant = {
  h1: {
    $$boldWeight: '$fontWeights$bold',
    fontSize: '$5xl',
    '@md': {
      fontSize: '7xl',
    },
    '@lg': {
      fontSize: '$9xl',
    },
    '@xl': {
      fontSize: '$10xl',
    },
    '@2xl': {
      fontSize: '$12xl',
    },
  },
  h2: {
    $$boldWeight: '$fontWeights$bold',
    fontSize: '$4xl',
    '@lg': {
      fontSize: '$6xl',
    },
    '@xl': {
      fontSize: '$8xl',
    },
    '@2xl': {
      fontSize: '$9xl',
    },
  },
  h3: {
    $$boldWeight: '$fontWeights$semiBold',
    fontSize: '$2xl',
    '@lg': {
      fontSize: '$4xl',
    },
    '@xl': {
      fontSize: '$5xl',
    },
    '@2xl': {
      fontSize: '$6xl',
    },
  },
  h4: {
    $$boldWeight: '$fontWeights$semiBold',
    fontSize: '$xl',
    '@lg': {
      fontSize: '$2xl',
    },
    '@xl': {
      fontSize: '$3xl',
    },
    '@2xl': {
      fontSize: '$4xl',
    },
  },
  h5: {
    $$boldWeight: '$fontWeights$semiBold',
    fontSize: '$lg',
    '@xl': {
      fontSize: '$xl',
    },
    '@2xl': {
      fontSize: '$4xl',
    },
  },
  h6: {
    $$boldWeight: '$fontWeights$semiBold',
    fontSize: '$base',
    '@xl': {
      fontSize: '$md',
    },
    '@2xl': {
      fontSize: '$lg',
    },
  },
  p: { $$boldWeight: '$fontWeights$semiBold' },
  span: { $$boldWeight: '$fontWeights$semiBold' },
  code: { $$boldWeight: '$fontWeights$semiBold' },
} as const;

export const fontVariant = {
  main: {
    fontFamily: '$main',
  },
  mono: {
    fontFamily: '$mono',
  },
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

export const transformVariant = {
  capitalize: {
    textTransform: 'capitalize',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  lowercase: {
    textTransform: 'lowercase',
  },
  none: {
    textTransform: 'none',
  },
};

export const BaseText = styled('span', {
  fontWeight: '$regular',
  color: '$foreground',
  lineHeight: '$base',
  $$boldWeight: '$bold',

  variants: {
    variant: elementVariant,
    font: fontVariant,
    bold: boldVariant,
    transform: transformVariant,
  },

  defaultVariants: {
    variant: 'span',
    font: 'main',
    bold: 'false',
    transform: 'none',
  },

  compoundVariants: [
    {
      font: 'main',
      bold: false,
      variant: 'h1',
      css: {
        fontWeight: '$light',
      },
    },
    {
      font: 'main',
      bold: false,
      variant: 'h2',
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
