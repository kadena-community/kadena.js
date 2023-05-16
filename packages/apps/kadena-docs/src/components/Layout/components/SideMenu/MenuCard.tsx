import { StyledSection } from './styles';

import React, { FC, MouseEventHandler, ReactNode } from 'react';

export interface IMenuCardProps {
  children?: ReactNode;
  active: number;
  idx: number;
  onClick?: MouseEventHandler<HTMLUListElement>;
  cyTestId?: string;
}

export const MenuCard: FC<IMenuCardProps> = ({
  children,
  onClick,
  active,
  idx = 0,
  cyTestId,
}) => {
  return (
    <StyledSection
      data-cy={cyTestId}
      animateLeft2Right={idx === 0}
      active={active === idx}
      onClick={onClick}
    >
      {children}
    </StyledSection>
  );
};
