import { activeLinkClass, linkClass } from './NavHeader.css';
import { NavHeaderNavigationContext } from './NavHeaderNavigation.context';

import classNames from 'classnames';
import type { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import React, { useContext, useEffect, useRef } from 'react';

export interface INavHeaderLinkProps {
  children: ReactNode;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: HTMLAttributeAnchorTarget;
  asChild?: boolean;
}

function hasPath(path: string, basePath: string): boolean {
  return path.indexOf(basePath) === 0;
}

export const NavHeaderLink: FC<INavHeaderLinkProps> = ({
  children,
  onClick,
  asChild = false,
  href,
  ...restProps
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const { setGlowPosition, setActiveHref, activeHref } = useContext(
    NavHeaderNavigationContext,
  );

  const className = classNames(linkClass, {
    [activeLinkClass]: activeHref ? hasPath(activeHref, href) : false,
  });

  useEffect(() => {
    if (activeHref && hasPath(activeHref, href) && ref.current) {
      setGlowPosition(ref.current.getBoundingClientRect());
    }
  }, [activeHref, href, setGlowPosition]);

  const _onClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setGlowPosition(e.currentTarget.getBoundingClientRect());
    setActiveHref(href);
    if (onClick) onClick(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...restProps,
      ...children.props,
      children: children.props.children,
      className: className,
      onClick: _onClick,
      href,
      ref,
    });
  }

  return (
    <li>
      <a
        ref={ref}
        className={className}
        onClick={_onClick}
        href={href}
        {...restProps}
      >
        {children}
      </a>
    </li>
  );
};
