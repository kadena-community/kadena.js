import type { FC } from 'react';
import type { IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsContainer } from './Breadcrumbs';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';
import { BreadcrumbsItem } from './BreadcrumbsItem';

interface IBreadcrumbs {
  Root: FC<IBreadcrumbsProps>;
  Item: FC<IBreadcrumbItemProps>;
}

export type { IBreadcrumbItemProps, IBreadcrumbsProps };

export const Breadcrumbs: IBreadcrumbs = {
  Root: BreadcrumbsContainer,
  Item: BreadcrumbsItem,
};
