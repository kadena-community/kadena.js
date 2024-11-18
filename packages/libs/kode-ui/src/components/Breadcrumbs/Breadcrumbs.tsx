import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { AriaBreadcrumbsProps } from 'react-aria';
import { useBreadcrumbs } from 'react-aria';
import { Stack, Text } from '..';
import { containerClass, navClass } from './Breadcrumbs.css';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';

export interface IBreadcrumbsProps extends AriaBreadcrumbsProps {
  children?:
    | FunctionComponentElement<IBreadcrumbItemProps>
    | FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: React.ReactElement;
  badge?: React.ReactElement;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({
  icon,
  badge,
  ...breadcrumbProps
}) => {
  const { navProps } = useBreadcrumbs(breadcrumbProps);
  const childCount = React.Children.count(breadcrumbProps.children);

  return (
    <nav className={navClass} {...navProps}>
      {icon && (
        <Stack marginInline="sm">
          <Text>{icon}</Text>
        </Stack>
      )}
      {badge && <Stack marginInlineEnd="xs">{badge}</Stack>}
      <ol className={containerClass}>
        {React.Children.map(breadcrumbProps.children, (child, i) =>
          React.cloneElement(child as any, { isCurrent: i === childCount - 1 }),
        )}
      </ol>
    </nav>
  );
};
