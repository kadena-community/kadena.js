import type { VariantProps } from '@stitches/react';
import type { FC } from 'react';
import React from 'react';
import { BaseText } from './styles';

export interface IHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: VariantProps<typeof BaseText>['variant'];
  font?: VariantProps<typeof BaseText>['font'];
  bold?: VariantProps<typeof BaseText>['bold'];
  color?: VariantProps<typeof BaseText>['color'];
  transform?: VariantProps<typeof BaseText>['transform'];
  children: React.ReactNode;
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  variant,
  font,
  bold = true,
  color = 'emphasize',
  transform,
  children,
}) => {
  return (
    <BaseText
      as={as}
      variant={variant ?? as}
      font={font}
      bold={bold}
      color={color}
      transform={transform}
    >
      {children}
    </BaseText>
  );
};
