import { NavLink } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

export const NavItem: FC<IProps> = ({ children, href = '' }) => {
  return (
    <li>
      <NavLink href={href}>{children}</NavLink>
    </li>
  );
};
