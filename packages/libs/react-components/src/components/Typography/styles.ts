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

export const boldVariant = {
  true: {
    fontWeight: '$extraBold',
  },
  false: {
    fontWeight: '$light',
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

// TODO: Add lineheight
export const BaseText = styled('span', {
  variants: {
    font: fontVariant,
    bold: boldVariant,
  },

  defaultVariants: {
    font: 'main',
    bold: 'false',
  },

  // NOTE: There is no bold version of the mono font in the design system.
  compoundVariants: [
    {
      font: 'mono',
      bold: true,
      css: {
        fontWeight: '$regular',
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
