import { ProductIcon } from '../Icons';

import {
  iconContainer,
  itemClass,
  linkClass,
  spanClass,
} from './Breadcrumbs.css';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItemProps {
  children?: ReactNode;
  icon?: typeof ProductIcon[keyof typeof ProductIcon];
  href?: string;
}

export const BreadcrumbsItem: FC<IBreadcrumbItemProps> = ({
  children,
  icon,
  href,
}) => {
  const Icon = icon;

  return (
    <li className={itemClass}>
      {Icon && (
        <div className={iconContainer}>
          <Icon size="sm" />
        </div>
      )}

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
