import { BreadcrumbsContainer, IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsItem, IBreadcrumbItemProps } from './BreadcrumbsItem';

import { FC } from 'react';

interface IBreadcrumbs {
  Root: FC<IBreadcrumbsProps>;
  Item: FC<IBreadcrumbItemProps>;
}

export { IBreadcrumbsProps, IBreadcrumbItemProps };

export const Breadcrumbs: IBreadcrumbs = {
  Root: BreadcrumbsContainer,
  Item: BreadcrumbsItem,
};
