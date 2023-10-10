import {
  navAccordionDeepLinkClass,
  navAccordionLinkActiveClass,
  navAccordionLinkClass,
  navAccordionListItemClass,
  navAccordionShallowLinkClass,
} from './NavAccordion.css';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface INavAccordionLinkProps {
  active?: boolean;
  asChild?: boolean;
  children: ReactNode;
  deepLink?: boolean;
  href?: string;
  shallowLink?: boolean;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({
  active,
  asChild,
  children,
  deepLink,
  href,
  shallowLink,
  ...restProps
}) => {
  const LinkElement = (
    <a
      className={classNames(navAccordionLinkClass, {
        [navAccordionDeepLinkClass]: deepLink,
        [navAccordionLinkActiveClass]: active,
        [navAccordionShallowLinkClass]: shallowLink,
      })}
      href={href}
    >
      {children}
    </a>
  );
  return shallowLink ? (
    LinkElement
  ) : (
    <li className={navAccordionListItemClass}>
      {asChild && React.isValidElement(children)
        ? React.cloneElement(children, {
            ...restProps,
            ...children.props,
            className: navAccordionLinkClass,
            children: children.props.children,
          })
        : LinkElement}
    </li>
  );
};
