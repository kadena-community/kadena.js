import { BaseText } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface IHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
  children: React.ReactNode;
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  font,
  bold,
  children,
}) => {
  return (
    <BaseText as={as} font={font} bold={bold}>
      {children}
    </BaseText>
  );
};
