import { StyledNavItem, StyledNavItemIcon, StyledNavItemText } from './styles';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

export const NavLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: string;
  props?: any;
}) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <StyledNavItem
      href={href}
      className={`${props} ${isActive ? 'active' : ''}`}
    >
      <StyledNavItemIcon>K:</StyledNavItemIcon>
      <StyledNavItemText className={`${props} ${isActive ? 'active' : ''}`}>
        {children}
      </StyledNavItemText>
    </StyledNavItem>
  );
};
