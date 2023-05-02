import { StyledSection } from './styles';

import React, { FC, MouseEventHandler, ReactNode } from 'react';

export interface IMenuCardProps {
  children?: ReactNode;
  active: number;
  idx: number;
  ref?: React.ForwardedRef<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLUListElement>;
  cyTestId?: string;
}

export const MenuCard: FC<IMenuCardProps> = React.forwardRef(
  ({ children, onClick, active, idx = 0, cyTestId }, ref) => {
    return (
      <StyledSection
        data-cy={cyTestId}
        animateLeft2Right={idx === 0}
        active={active === idx}
        ref={ref}
        onClick={onClick}
      >
        {children}
      </StyledSection>
    );
  },
);
MenuCard.displayName = 'MenuCard';
