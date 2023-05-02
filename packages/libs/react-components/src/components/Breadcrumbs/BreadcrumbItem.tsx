import { ProcuctIcons } from '../ProductIcons';

import { StyledBreadcrumbItem } from './styles';

import React, { FC, ReactNode } from 'react';

export interface IBreadcrumbItem {
  children?: ReactNode;
  icon?: typeof ProcuctIcons[keyof typeof ProcuctIcons];
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
