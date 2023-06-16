import { BreadcrumbsContainer, IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsItem, IBreadcrumbItemProps } from './BreadcrumbsItem';

import { FC } from 'react';

interface IBreadcrumbs {
  Container: FC<IBreadcrumbsProps>;
  Item: FC<IBreadcrumbItemProps>;
}

export { IBreadcrumbsProps, IBreadcrumbItemProps };

export const Breadcrumbs: IBreadcrumbs = {
  Container: BreadcrumbsContainer,
  Item: BreadcrumbsItem,
};
