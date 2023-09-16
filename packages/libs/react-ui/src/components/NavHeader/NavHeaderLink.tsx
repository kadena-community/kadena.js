import { activeLinkClass, linkClass } from './NavHeader.css';

import classNames from 'classnames';
import type { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import React from 'react';

export interface INavHeaderLinkProps {
  active?: boolean;
  children: ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: HTMLAttributeAnchorTarget;
  asChild?: boolean;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  active,
  children,
  asChild = false,
  ...restProps
}) => {
  const className = classNames(linkClass, {
    [activeLinkClass]: active,
  });

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      className: className,
      children: children.props.children,
    });
  }

  return (
    <a className={className} {...restProps}>
      {children}
    </a>
  );
};
