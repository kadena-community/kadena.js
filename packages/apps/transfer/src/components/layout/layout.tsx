import React, { type ReactNode } from 'react';
import './layout.css';

interface IProps {
  children?: ReactNode;
}

export const Layout = ({ children }: IProps): JSX.Element => (
  <div className="layout">
    <main>{children}</main>
  </div>
);

export default Layout;
