import { styled } from '../../styles/stitches.config';

import { BaseText, textSizeVariant } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledText = styled(BaseText, {
  variants: {
    size: textSizeVariant,
  },

  defaultVariants: {
    size: 'lg',
  },
});

export interface ITextProps {
  as?: 'span' | 'p' | 'code';
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
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
