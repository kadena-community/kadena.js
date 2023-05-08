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
      {React.Children.map(children, (child) => {
        if (child === undefined) return;
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(
          child,
          {},
          Icon && <Icon size="sm" />,
          child.props.children,
        );
      })}
    </StyledBreadcrumbItem>
  );
};
