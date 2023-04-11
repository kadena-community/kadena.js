import { NavLink } from './styles';

import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

export const NavItem: FC<IProps> = ({ children, href = '' }) => {
  const router = useRouter();
  return (
    <li>
      <NavLink href={href}>{children}</NavLink>
    </li>
  );
};
