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

  const classNames = ['block', 'px-5', 'leading-10'];

  if (isActive) {
    classNames.push('bg-[#050505]/50');
    classNames.push('font-medium');
    classNames.push('underline');
  } else {
    classNames.push('bg-[#505050]/50');
    classNames.push('font-normal');
  }

  if (props.className) {
    classNames.push(props.className);
  }

  return <StyledLink {...props} className={classNames.join(' ')} />;
}
