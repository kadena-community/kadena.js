import { styled } from '../../styles/stitches.config';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const StyledSubHeading = styled('span', {
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
        fontWeight: '$bold',
      },
      false: {
        fontWeight: '$regular',
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

export interface ISubHeadingProps {
  as?: 'h3' | 'h4' | 'h5' | 'h6';
  font?: VariantProps<typeof StyledSubHeading>['font'];
  bold?: VariantProps<typeof StyledSubHeading>['bold'];
  children: React.ReactNode;
}

export const SubHeading: FC<ISubHeadingProps> = ({
  as,
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
