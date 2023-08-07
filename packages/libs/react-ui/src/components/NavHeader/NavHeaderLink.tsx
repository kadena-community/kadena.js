import { linkClass } from './NavHeader.css';

import React, { FC } from 'react';

export interface INavHeaderLinkProps {
  children: React.ReactNode;
  href: string;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({ children, href }) => {
  return (
    <a className={linkClass} href={href}>
      {children}
    </a>
  );
};
