import {
  StyledNavItem,
  StyledNavItemIcon,
  StyledNavItemText,
} from '@/components/Global/NavLink/styles';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

export const NavLink = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <StyledNavItem
      href={href}
      className={`${className} ${isActive ? 'active' : ''}`}
      {...props}
    >
      <StyledNavItemIcon>K:</StyledNavItemIcon>
      <StyledNavItemText className={isActive ? 'active' : ''}>
        {children}
      </StyledNavItemText>
    </StyledNavItem>
  );
};
