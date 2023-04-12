import { NavLink } from './styles';

import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

export const NavItem: FC<IProps> = ({ children, href = '' }) => {
  const router = useRouter();
  const active = href === router.pathname;

  return (
    <li>
      <NavLink data-active={active} href={href}>
        {children}
      </NavLink>
    </li>
  );
};
