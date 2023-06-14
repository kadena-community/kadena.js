import { StyledLayout } from '@/components/Common/Layout/styles';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => (
  <StyledLayout className="layout">
    <main>{children}</main>
  </StyledLayout>
);

export default Layout;
