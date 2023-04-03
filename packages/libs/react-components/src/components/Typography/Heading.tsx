import { styled } from '../../styles/stitches.config';

import { bold as variantBold, font as variantFont } from './variants';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledHeading = styled('span', {
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

export interface IHeadingProps {
  as?: 'h1' | 'h2';
  font?: VariantProps<typeof StyledHeading>['font'];
  bold?: VariantProps<typeof StyledHeading>['bold'];
  children: React.ReactNode;
}

// TODO: add line height
export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  font,
  bold,
  children,
}) => {
  return (
    <StyledHeading as={as} font={font} bold={bold}>
      {children}
    </StyledHeading>
  );
};
