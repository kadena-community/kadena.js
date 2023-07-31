import { default as NextLink } from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
  href: string;
}

export const Link: FC<IProp> = ({ children, href, ...props }) => {
  if (typeof children === 'string' && children.includes('http')) {
    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    );
  }

  return (
    <a {...props} href={href}>
      {children}
    </a>
  );
};
