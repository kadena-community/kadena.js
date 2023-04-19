import { StyledSection } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IMenuCardProps {
  children?: ReactNode;
  active: number;
  idx: number;
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export const MenuCard: FC<IMenuCardProps> = React.forwardRef(
  ({ children, active, idx = 0 }, ref) => {
    return (
      <StyledSection
        animateLeft2Right={idx === 0}
        active={active === idx}
        ref={ref}
      >
        {children}
      </StyledSection>
    );
  },
);
MenuCard.displayName = 'MenuCard';
