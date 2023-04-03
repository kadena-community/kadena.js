import { styled } from '../../styles/stitches.config';

import { bold as variantBold, font as variantFont } from './variants';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledSubHeading = styled('span', {
  variants: {
    font: variantFont,
    bold: variantBold,
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

export interface ISubHeadingProps {
  as?: 'h3' | 'h4' | 'h5' | 'h6';
  font?: VariantProps<typeof StyledSubHeading>['font'];
  bold?: VariantProps<typeof StyledSubHeading>['bold'];
  children: React.ReactNode;
}

export const SubHeading: FC<ISubHeadingProps> = ({
  as = 'h3',
  font,
  bold,
  children,
}) => {
  return (
    <StyledSubHeading as={as} font={font} bold={bold}>
      {children}
    </StyledSubHeading>
  );
};
