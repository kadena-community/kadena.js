import { styled } from '../../styles/stitches.config';

import * as variants from './variants';

import type * as Stitches from '@stitches/react';
import React, { FC } from 'react';

const FlexContainer = styled('div', {
  display: 'flex',

  variants: {
    direction: variants.direction,
    justifyContent: variants.justifyContent,
    alignItems: variants.alignItems,
    flexWrap: variants.flexWrap,
    spacing: variants.spacing,
  },

  defaultVariants: {
    spacing: 'md',
    direction: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },
});

export interface IStackProps {
  spacing?: Stitches.VariantProps<typeof FlexContainer>['spacing'];
  direction?: Stitches.VariantProps<typeof FlexContainer>['direction'];
  flexWrap?: Stitches.VariantProps<typeof FlexContainer>['flexWrap'];
  alignItems?: Stitches.VariantProps<typeof FlexContainer>['alignItems'];
  justifyContent?: Stitches.VariantProps<
    typeof FlexContainer
  >['justifyContent'];
  children: React.ReactNode;
}

export const Stack: FC<IStackProps> = ({
  alignItems,
  children,
  direction,
  flexWrap,
  justifyContent,
  spacing,
}) => {
  return (
    <FlexContainer
      spacing={spacing}
      direction={direction}
      flexWrap={flexWrap}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </FlexContainer>
  );
};
