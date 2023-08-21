import type { IBreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsRoot } from './Breadcrumbs';
import type { IBreadcrumbItemProps } from './BreadcrumbsItem';
import { BreadcrumbsItem } from './BreadcrumbsItem';

import type { FC } from 'react';

export type { IBreadcrumbsProps, IBreadcrumbItemProps };

interface IBreadcrumbs {
  Root: FC<IBreadcrumbsProps>;
  Item: FC<IBreadcrumbItemProps>;
}

export const Breadcrumbs: IBreadcrumbs = {
  Root: BreadcrumbsRoot,
  Item: BreadcrumbsItem,
};
