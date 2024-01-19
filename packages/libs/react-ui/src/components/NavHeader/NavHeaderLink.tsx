'use client';
import cn from 'classnames';
import type {
  ComponentPropsWithRef,
  FC,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from 'react';
import React, { useContext, useRef } from 'react';
import { NavHeaderContext } from './NavHeader.context';
import { linkClass } from './NavHeader.css';

export interface INavHeaderLinkProps extends ComponentPropsWithRef<'a'> {
  children: ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: HTMLAttributeAnchorTarget;
  asChild?: boolean;
}

function getDataState(path?: string, basePath?: string): 'active' | 'inactive' {
  if (!path || !basePath) return 'inactive';

  return path.indexOf(basePath) === 0 ? 'active' : 'inactive';
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  children,
  onClick,
  asChild = false,
  href,
  className,
  ...restProps
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const { setActiveHref, activeHref } = useContext(NavHeaderContext);

  const _onClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setActiveHref(href);
    if (onClick) onClick(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      href,
      ...children.props,
      children: children.props.children,
      className: cn(linkClass, className, children.props.className),
      onClick: _onClick,
      ref,
      'data-state': getDataState(activeHref, children.props.href || href),
    });
  }

  return (
    <li>
      <a
        ref={ref}
        className={cn(linkClass, className)}
        onClick={_onClick}
        href={href}
        data-state={getDataState(activeHref, href)}
        {...restProps}
      >
        {children}
      </a>
    </li>
  );
};
