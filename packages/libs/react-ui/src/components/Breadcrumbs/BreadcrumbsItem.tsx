import { itemClass, linkClass, spanClass } from './Breadcrumbs.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

export interface IBreadcrumbItemProps {
  children?: ReactNode;
  href?: string;
  asChild?: boolean;
}

export const BreadcrumbsItem: FC<IBreadcrumbItemProps> = ({
  children,
  href,
  asChild = false,
}) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <li className={itemClass}>
        {React.cloneElement(children, {
          href,
          className: linkClass,
          ...children.props,
        })}
      </li>
    );
  }

  return (
    <li className={itemClass}>
      {href !== undefined ? (
        <a className={linkClass} href={href}>
          {children}
        </a>
      ) : (
        <span className={spanClass}>{children}</span>
      )}
    </li>
  );
};
