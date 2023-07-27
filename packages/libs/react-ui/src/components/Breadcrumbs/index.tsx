import type { IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsContainer } from './Breadcrumbs';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';
import { BreadcrumbsItem } from './BreadcrumbsItem';

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
