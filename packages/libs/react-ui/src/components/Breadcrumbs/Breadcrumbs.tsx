import { ProductIcon } from '@components/Icon';

import { containerClass, iconContainer, navClass } from './Breadcrumbs.css';
import { IBreadcrumbItemProps } from './BreadcrumbsItem';

import React, { FC, FunctionComponentElement } from 'react';

export interface IBreadcrumbsProps {
  children?: FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: (typeof ProductIcon)[keyof typeof ProductIcon];
}

export const BreadcrumbsContainer: FC<IBreadcrumbsProps> = ({
  children,
  icon,
}) => {
  const Icon = icon;
  return (
    <nav className={navClass} data-testid="kda-breadcrumbs">
      {Icon && (
        <span className={iconContainer}>
          <Icon size="sm" />
        </span>
      )}
      <ul className={containerClass}>{children}</ul>
    </nav>
  );
};
