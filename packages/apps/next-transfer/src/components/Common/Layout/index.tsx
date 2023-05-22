import { StyledLayout } from './styles';

import React, { type ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Layout = ({ children }: IProps) => (
  <StyledLayout className="layout">
    <main>{children}</main>
  </StyledLayout>
);

export default Layout;
