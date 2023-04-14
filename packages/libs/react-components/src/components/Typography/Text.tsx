import { BaseText, Text as StyledText } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface ITextProps {
  as?: 'span' | 'p' | 'code';
  variant?: VariantProps<typeof BaseText>['variant'];
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
  size?: VariantProps<typeof StyledText>['size'];
  transform?: VariantProps<typeof BaseText>['transform'];
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({
  as,
  variant,
  font,
  bold,
  size,
  transform,
  children,
}) => {
  return (
    <StyledText
      as={as}
      variant={variant ?? as}
      font={font}
      bold={bold}
      size={size}
      transform={transform}
    >
      {children}
    </StyledText>
  );
};
