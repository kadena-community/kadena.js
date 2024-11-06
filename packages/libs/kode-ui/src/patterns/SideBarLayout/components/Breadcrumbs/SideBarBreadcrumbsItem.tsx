import type { FC } from 'react';
import React from 'react';

import type { IBreadcrumbItemProps } from './../../../../components';
import { BreadcrumbsItem } from './../../../../components';

export const SideBarBreadcrumbsItem: FC<IBreadcrumbItemProps> = ({
  children,
  ...props
}) => {
  return <BreadcrumbsItem {...props}>{children}</BreadcrumbsItem>;
};
