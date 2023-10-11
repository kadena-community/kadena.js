import { navAccordionLinkClass } from './NavAccordion.css';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface INavAccordionLinkProps {
  active?: boolean;
  asChild?: boolean;
  children: ReactNode;
  deepLink?: boolean;
  href?: string;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({
  asChild,
  children,
  href,
}) => {
  return (
    <a className={classNames(navAccordionLinkClass)} href={href}>
      {children}
    </a>
  );
};
