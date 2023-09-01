import { type BaseText, Text as StyledText } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { type FC } from 'react';

export interface ITextProps {
  as?: 'span' | 'p' | 'code' | 'label';
  variant?: VariantProps<typeof BaseText>['variant'];
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
  color?: VariantProps<typeof BaseText>['color'];
  transform?: VariantProps<typeof BaseText>['transform'];
  size?: VariantProps<typeof StyledText>['size'];
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({
  as,
  variant,
  font,
  bold,
  size,
  color,
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
      color={color}
    >
      {children}
    </StyledText>
  );
};
