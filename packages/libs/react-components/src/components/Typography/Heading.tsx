import { styled } from '../../styles/stitches.config';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledHeading = styled('span', {
  variants: {
    font: {
      main: {
        fontFamily: '$main',
      },
      mono: {
        fontFamily: '$mono',
      },
    },
    bold: {
      true: {
        fontWeight: '$extraBold',
      },
      false: {
        fontWeight: '$light',
      },
    },
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

export const Heading: FC<IHeadingProps> = ({ as, font, bold, children }) => {
  return (
    <StyledHeading as={as} font={font} bold={bold}>
      {children}
    </StyledHeading>
  );
};
