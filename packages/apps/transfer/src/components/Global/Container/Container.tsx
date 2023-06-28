import { StyledContainer } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IContainerProps {
  type?: 'fluid' | 'fixed';
  className?: string;
  children: ReactNode;
}

const Container: FC<IContainerProps> = ({
  children,
  type = 'fluid',
  className,
}) => (
  <StyledContainer type={type} className={className}>
    {children}
  </StyledContainer>
);

export default Container;
