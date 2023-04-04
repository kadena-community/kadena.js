import { styled } from '../../styles/stitches.config';

import {
  alignItemsVariant,
  directionVariant,
  flexWrapVariant,
  justifyContentVariant,
  spacingVariant,
} from './styles';

import type { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

const FlexContainer = styled('div', {
  display: 'flex',

  variants: {
    direction: directionVariant,
    justifyContent: justifyContentVariant,
    alignItems: alignItemsVariant,
    flexWrap: flexWrapVariant,
    spacing: spacingVariant,
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
