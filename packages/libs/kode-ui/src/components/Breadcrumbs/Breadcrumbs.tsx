import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { AriaBreadcrumbsProps } from 'react-aria';
import { useBreadcrumbs } from 'react-aria';
import { Box } from '..';
import { containerClass, navClass } from './Breadcrumbs.css';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';

export interface IBreadcrumbsProps extends AriaBreadcrumbsProps {
  children:
    | FunctionComponentElement<IBreadcrumbItemProps>
    | FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: React.ReactElement;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({
  icon,
  ...breadcrumbProps
}) => {
  const { navProps } = useBreadcrumbs(breadcrumbProps);
  const childCount = React.Children.count(breadcrumbProps.children);

  return (
    <nav className={navClass} {...navProps}>
      {icon && <Box marginInline="sm">{icon}</Box>}
      <ol className={containerClass}>
        {React.Children.map(breadcrumbProps.children, (child, i) =>
          React.cloneElement(child as any, { isCurrent: i === childCount - 1 }),
        )}
      </ol>
    </nav>
  );
};
