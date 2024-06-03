import { default as NextLink } from 'next/link';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { linkClass } from './styles.css';

interface IProp {
  children: ReactNode;
  href: string;
}

//this is a fix for the remark plugin remarkGfm, that adds an extra "\" in params of a link
const fixLink = (url: string): string => {
  return url.replace(/(\\|%5c)&/gim, '&');
};

export const Link: FC<IProp> = ({ children, href, ...props }) => {
  if (typeof children === 'string' && !href.includes('http')) {
    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    );
  }

  const newChildren =
    typeof children === 'string' ? fixLink(children) : children;
  return (
    <a className={linkClass} {...props} href={fixLink(href)}>
      {newChildren}
    </a>
  );
};
