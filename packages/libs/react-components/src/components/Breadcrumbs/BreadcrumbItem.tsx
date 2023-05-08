import { ProductIcons } from '../ProductIcons';

import { StyledBreadcrumbItem } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItem {
  children?: ReactNode;
  icon?: typeof ProductIcons[keyof typeof ProductIcons];
}

export const BreadcrumbItem: FC<IBreadcrumbItem> = ({ children, icon }) => {
  const Icon = icon;
  return (
    <StyledBreadcrumbItem>
      {Icon && <Icon size="sm" />}
      {children}
    </StyledBreadcrumbItem>
  );
};
