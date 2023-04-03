import { styled } from '../../styles/stitches.config';

import type * as Stitches from '@stitches/react';
import React, { FC } from 'react';

const FlexContainer = styled('div', {
  display: 'flex',

  variants: {
    direction: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
    justifyContent: {
      'flex-start': {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      'flex-end': {
        justifyContent: 'flex-end',
      },
      'space-between': {
        justifyContent: 'space-between',
      },
      'space-around': {
        justifyContent: 'space-around',
      },
    },
    alignItems: {
      'flex-start': {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      'flex-end': {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
    },
    flexWrap: {
      wrap: {
        flexWrap: 'wrap',
      },
      nowrap: {
        flexWrap: 'nowrap',
      },
    },
    spacing: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '2xs': {
        gap: '$2xs',
      },
      xs: {
        gap: '$xs',
      },
      sm: {
        gap: '$3',
      },
      md: {
        gap: '$md',
      },
      lg: {
        gap: '$lg',
      },
      xl: {
        gap: '$xl',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '2xl': {
        gap: '$2xl',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '3xl': {
        gap: '$3xl',
      },
    },
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
