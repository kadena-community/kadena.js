import type { FC, ReactNode } from 'react';
import React from 'react';
import { StyledContainer } from './styles';

export interface IContainerProps {
  type?: 'fluid' | 'fixed';
  className?: string;
  children: ReactNode;
}

const Container: FC<IContainerProps> = ({ children, type = 'fluid', className }) => (
  <StyledContainer type={type} className={className}>
    {children}
  </StyledContainer>
);

export default Container;
