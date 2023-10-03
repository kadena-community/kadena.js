import {
  navAccordionDeepLinkClass,
  navAccordionLinkActiveClass,
  navAccordionLinkClass,
  navAccordionListItemClass,
} from './NavAccordion.css';

import { Link } from '@components/Link';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface INavAccordionLinkProps {
  active?: boolean;
  children?: string;
  deepLink?: boolean;
  href: string;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({
  active,
  children,
  deepLink,
  href,
}) => {
  return (
    <li className={navAccordionListItemClass}>
      <Link
        additionalClasses={classNames(navAccordionLinkClass, {
          [navAccordionDeepLinkClass]: deepLink,
          [navAccordionLinkActiveClass]: active,
        })}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};
