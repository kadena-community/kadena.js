import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import { containerClass, iconContainer, navClass } from './Breadcrumbs.css';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';

export interface IBreadcrumbsProps {
  children?: FunctionComponentElement<IBreadcrumbItemProps>[];
  startIcon?: React.ReactElement;
}

export const BreadcrumbsContainer: FC<IBreadcrumbsProps> = ({
  children,
  startIcon,
}) => {
  return (
    <nav className={navClass} data-testid="kda-breadcrumbs">
      {startIcon && <span className={iconContainer}>{startIcon}</span>}
      <ul className={containerClass}>{children}</ul>
    </nav>
  );
};
