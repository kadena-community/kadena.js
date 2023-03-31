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
        gap: '$1',
      },
      xs: {
        gap: '$2',
      },
      sm: {
        gap: '$3',
      },
      md: {
        gap: '$4',
      },
      lg: {
        gap: '$6',
      },
      xl: {
        gap: '$7',
        '@xl': {
          gap: '$8',
        },
        '@2xl': {
          gap: '$11',
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '2xl': {
        gap: '$9',
        '@lg': {
          gap: '$10',
        },
        '@xl': {
          gap: '$13',
        },
        '@2xl': {
          gap: '$17',
        },
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '3xl': {
        gap: '$10',
        '@md': {
          gap: '$12',
        },
        '@lg': {
          gap: '$15',
        },
        '@xl': {
          gap: '$15',
        },
        '@2xl': {
          gap: '$25',
        },
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
