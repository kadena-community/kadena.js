import { NavLink } from '../styles';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  active?: boolean;
}

export const NavItem: FC<IProps> = ({
  children,
  active = false,
  href = '',
}) => {
  return (
    <li>
      <NavLink active={active} href={href}>
        {children}
      </NavLink>
    </li>
  );
};
