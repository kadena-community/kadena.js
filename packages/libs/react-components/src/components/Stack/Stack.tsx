import { styled } from '../../styles/stitches.config';

import * as variants from './variants';

import type { VariantProps } from '@stitches/react';
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
  spacing?: VariantProps<typeof FlexContainer>['spacing'];
  direction?: VariantProps<typeof FlexContainer>['direction'];
  flexWrap?: VariantProps<typeof FlexContainer>['flexWrap'];
  alignItems?: VariantProps<typeof FlexContainer>['alignItems'];
  justifyContent?: VariantProps<typeof FlexContainer>['justifyContent'];
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
