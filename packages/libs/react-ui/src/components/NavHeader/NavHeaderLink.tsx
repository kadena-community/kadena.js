import { activeLinkClass, linkClass } from './NavHeader.css';

import classNames from 'classnames';
import React, { FC, HTMLAttributeAnchorTarget } from 'react';

export interface INavHeaderLinkProps {
  children: string;
  href: string;
  active?: boolean;
  target?: HTMLAttributeAnchorTarget | undefined;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  children,
  href,
  active,
  target,
}) => {
  return (
    <a
      className={classNames(linkClass, {
        [activeLinkClass]: active,
      })}
      href={href}
      target={target}
    >
      {children}
    </a>
  );
};
