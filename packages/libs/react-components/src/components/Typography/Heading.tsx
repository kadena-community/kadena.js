import { BaseText } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface IHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: VariantProps<typeof BaseText>['variant'];
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
  transform?: VariantProps<typeof BaseText>['transform'];
  children: React.ReactNode;
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  variant,
  font,
  bold,
  transform,
  children,
}) => {
  return (
    <BaseText
      as={as}
      variant={variant ?? as}
      font={font}
      bold={bold}
      transform={transform}
    >
      {children}
    </BaseText>
  );
};
