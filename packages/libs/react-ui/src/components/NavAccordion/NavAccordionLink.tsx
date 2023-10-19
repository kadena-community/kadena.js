import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { navAccordionLinkClass } from './NavAccordion.css';

export interface INavAccordionLinkProps {
  asChild?: boolean;
  children: ReactNode;
  href?: string;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({
  asChild,
  children,
  href,
  ...restProps
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      className: navAccordionLinkClass,
    });
  }
  return (
    <a className={classNames(navAccordionLinkClass)} href={href}>
      {children}
    </a>
  );
};
