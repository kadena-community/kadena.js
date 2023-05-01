import { StyledBreadcrumbItem } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItem {
  children?: ReactNode;
  first?: boolean;
}

export const BreadcrumbItem: FC<IBreadcrumbItem> = ({ children, first }) => {
  return <StyledBreadcrumbItem first={first}>{children}</StyledBreadcrumbItem>;
};
