import { activeLinkClass, linkClass } from './NavHeader.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface INavHeaderLinkProps {
  children: string;
  href: string;
  active?: boolean;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  children,
  href,
  active,
}) => {
  return (
    <a
      className={classNames(linkClass, {
        [activeLinkClass]: active,
      })}
      href={href}
    >
      {children}
    </a>
  );
};
