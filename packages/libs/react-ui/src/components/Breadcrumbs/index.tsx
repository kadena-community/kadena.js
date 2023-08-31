import { type IBreadcrumbsProps, BreadcrumbsContainer } from './Breadcrumbs';
import { type IBreadcrumbItemProps, BreadcrumbsItem } from './BreadcrumbsItem';

import { type FC } from 'react';

interface IBreadcrumbs {
  Root: FC<IBreadcrumbsProps>;
  Item: FC<IBreadcrumbItemProps>;
}

export type { IBreadcrumbsProps, IBreadcrumbItemProps };

export const Breadcrumbs: IBreadcrumbs = {
  Root: BreadcrumbsContainer,
  Item: BreadcrumbsItem,
};
