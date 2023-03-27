import { styled } from '../../styles/stitches.config';

import type * as Stitches from '@stitches/react';
import React, { MouseEventHandler, FC } from 'react';

const StyledButton = styled('button', {
  backgroundColor: '$$baseColor',
  borderRadius: '$md',
  fontSize: '$sm',
  color: '$$accentColor',
  '&:hover': {
    backgroundColor: '$$interactionColor',
  },

  variants: {
    variant: {
      default: {
        $$baseColor: '$colors$gray500',
        $$accentColor: '$colors$fontColor',
        $$interactionColor: '$colors$blue500',
      },
    },
    size: {
      sm: {
        padding: '$1 $2',
      },
      md: {
        padding: '$2 $3',
      },
      lg: {
        padding: '$3 $4',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface IButtonProps {
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: Stitches.VariantProps<typeof StyledButton>['size'];
}

export const Button: FC<IButtonProps> = ({ label, onClick, size }) => {
  return (
    <StyledButton size={size} onClick={onClick}>
      {label}
    </StyledButton>
  );
};
