import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { containerClass, iconContainer, navClass } from './Breadcrumbs.css';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';

export interface IBreadcrumbsProps {
  children?: FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: React.ReactElement;
}

export const BreadcrumbsContainer: FC<IBreadcrumbsProps> = ({
  children,
  icon,
}) => {
  return (
    <nav className={navClass} data-testid="kda-breadcrumbs">
      {icon && <span className={iconContainer}>{icon}</span>}
      <ul className={containerClass}>{children}</ul>
    </nav>
  );
};
