import { styled } from '../../styles/stitches.config';

import * as variants from './variants';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledText = styled('span', {
  variants: {
    font: variants.font,
    bold: variants.bold,
    size: variants.textSize,
  },

  defaultVariants: {
    font: 'main',
    bold: 'false',
    size: 'lg',
  },
});

export interface ITextProps {
  as?: 'span' | 'p' | 'code';
  font?: VariantProps<typeof StyledText>['font'];
  bold?: VariantProps<typeof StyledText>['bold'];
  size?: VariantProps<typeof StyledText>['size'];
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({ as, font, bold, size, children }) => {
  return (
    <StyledText as={as} font={font} bold={bold} size={size}>
      {children}
    </StyledText>
  );
};
