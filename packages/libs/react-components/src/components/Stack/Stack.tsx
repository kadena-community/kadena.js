import { styled } from '../../styles/stitches.config';

import type * as Stitches from '@stitches/react';
import React, { FC } from 'react';

const StyledStack = styled('div', {
  backgroundColor: '$gray100',
  padding: '$2',

  variants: {
    direction: {
      horizontal: {
        flexDirection: 'row',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
    spacing: {
      xxs: {
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
  },
});

export interface IStackProps {
  spacing?: Stitches.VariantProps<typeof StyledStack>['spacing'];
  direction?: Stitches.VariantProps<typeof StyledStack>['direction'];
  children: React.ReactNode;
  // TODO: custom gap
  // TODO: alignItems
  // TODO: justifyContent
}

export const Stack: FC<IStackProps> = ({ spacing, children, direction }) => {
  return (
    <StyledStack spacing={spacing} direction={direction}>
      {children}
    </StyledStack>
  );
};
