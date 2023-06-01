'use client';

import { StyledLink } from './styles';

import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavItem(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps & {
      children?: React.ReactNode;
    },
) {
  const pathname = usePathname();
  const isActive =
    pathname === null ? false : pathname.startsWith(props.href as string);

  return <StyledLink {...props} active={isActive} />;
}
