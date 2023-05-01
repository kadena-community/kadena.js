import { StyledBreadcrumbs } from './styles';
import { BreadcrumbItem, IBreadcrumbItem } from '.';

import React, { FC, FunctionComponentElement } from 'react';

export interface IBreadcrumbs {
  children?: FunctionComponentElement<IBreadcrumbItem>[];
}

export const Breadcrumbs: FC<IBreadcrumbs> = ({ children }) => {
  console.log(children);
  return (
    <StyledBreadcrumbs>
      {React.Children.map(children, (child) => {
        if (
          child === undefined ||
          child.type.displayName !== BreadcrumbItem.displayName
        )
          return null;

        return React.cloneElement<IBreadcrumbItem>(child, {});
      })}
    </StyledBreadcrumbs>
  );
};
