import {
  navAccordionDeepLinkClass,
  navAccordionLinkClass,
  navAccordionListItemClass,
} from './NavAccordion.css';

import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface INavAccordionLinkProps {
  children?: string;
  href: string;
  deepLink?: boolean;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({
  children,
  href,
  deepLink,
}) => {
  return (
    <li className={navAccordionListItemClass}>
      <a
        className={classNames(navAccordionLinkClass, {
          [navAccordionDeepLinkClass]: deepLink,
        })}
        href={href}
      >
        {children}
      </a>
    </li>
  );
};
