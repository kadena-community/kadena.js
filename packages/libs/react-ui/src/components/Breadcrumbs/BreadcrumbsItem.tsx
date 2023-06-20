import { itemClass, linkClass, spanClass } from './Breadcrumbs.css';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItemProps {
  children?: ReactNode;
  href?: string;
}

export const BreadcrumbsItem: FC<IBreadcrumbItemProps> = ({
  children,
  href,
}) => {
  return (
    <li className={itemClass}>
      {href !== undefined ? (
        <a className={linkClass} href={`#${href}`}>
          {children}
        </a>
      ) : (
        <span className={spanClass}>{children}</span>
      )}
    </li>
  );
};
