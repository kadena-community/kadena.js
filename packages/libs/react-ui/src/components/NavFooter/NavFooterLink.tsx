import type { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import React from 'react';
import { linkClass } from './NavFooter.css';

export type Target = '_self' | '_blank';
export interface INavFooterLinkProps {
  children: ReactNode;
  href?: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  asChild?: boolean;
}

export const NavFooterLink: FC<INavFooterLinkProps> = ({
  children,
  asChild = false,
  ...restProps
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      className: linkClass,
      children: children.props.children,
    });
  }

  return (
    <a className={linkClass} {...restProps} data-testid="kda-footer-link-item">
      {children}
    </a>
  );
};
