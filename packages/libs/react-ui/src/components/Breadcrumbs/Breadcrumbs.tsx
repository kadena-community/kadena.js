import { ProductIcon } from '@components/Icon';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { containerClass, iconContainer, navClass } from './Breadcrumbs.css';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';

export interface IBreadcrumbsProps {
  children?: FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: keyof typeof ProductIcon;
}

export const BreadcrumbsContainer: FC<IBreadcrumbsProps> = ({
  children,
  icon,
}) => {
  const Icon = icon && ProductIcon[icon];

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
