import { styled } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

export interface IMenuCardProps {
  children?: ReactNode;
  active: number;
  idx: number;
}

const StyledSection = styled('section', {
  position: 'absolute',
  transition: 'transform .2s ease',
  width: '100%',
  defaultVariants: {
    active: false,
    l2r: true,
  },
  variants: {
    active: {
      true: {
        transform: 'translateX(0)',
      },
      false: {},
    },
    l2r: {
      false: {},
      true: {},
    },
  },
  compoundVariants: [
    {
      active: false,
      l2r: true,
      css: {
        transform: 'translateX(-100%)',
      },
    },
    {
      active: false,
      l2r: false,
      css: {
        transform: 'translateX(100%)',
      },
    },
  ],
});

export const MenuCard: FC<IMenuCardProps> = ({ children, active, idx = 0 }) => {
  return (
    <StyledSection l2r={idx === 0} active={active === idx}>
      {children}
    </StyledSection>
  );
};
