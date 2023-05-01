import { StyledBreadcrumbItem } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItem {
  children?: ReactNode;
}

export const BreadcrumbItem: FC<IBreadcrumbItem> = ({ children }) => {
  return <StyledBreadcrumbItem>{children}</StyledBreadcrumbItem>;
};
