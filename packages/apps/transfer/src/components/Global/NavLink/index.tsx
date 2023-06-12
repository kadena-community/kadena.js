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

  if (isActive) {
    // @ts-ignore
    props.className += ' active';
  }

  return (
    <StyledNavItem href={href} {...props}>
      <StyledNavItemIcon>K:</StyledNavItemIcon>
      <StyledNavItemText {...props}>{children}</StyledNavItemText>
    </StyledNavItem>
  );
};
