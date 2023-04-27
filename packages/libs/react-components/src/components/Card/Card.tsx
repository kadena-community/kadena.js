import { StyledCard } from './styles';

import React, { FC } from 'react';

export interface ICardProps {
  children: React.ReactNode;
  color?: string;
  expand?: boolean;
}

export const Card: FC<ICardProps> = ({
  children,
  expand = false,
  color = 'default',
}) => {
  return (
    // eslint-disable-next-line
    <StyledCard color={color as any} expand={expand as any}>
      {children}
    </StyledCard>
  );
};
