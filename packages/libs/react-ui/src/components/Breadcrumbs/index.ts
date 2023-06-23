import { BreadcrumbsContainer, IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsItem, IBreadcrumbItemProps } from './BreadcrumbsItem';

import { FC } from 'react';

interface IBreadcrumbs extends FC<IBreadcrumbsProps> {
  Item: FC<IBreadcrumbItemProps>;
}

export { IBreadcrumbsProps, IBreadcrumbItemProps };

export const Breadcrumbs: IBreadcrumbs = BreadcrumbsContainer as IBreadcrumbs;
Breadcrumbs.Item = BreadcrumbsItem;
