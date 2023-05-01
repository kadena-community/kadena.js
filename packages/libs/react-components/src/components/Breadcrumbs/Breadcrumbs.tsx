import { StyledBreadcrumbs } from './styles';
import { IBreadcrumbItem } from '.';

import React, { FC } from 'react';

export interface IBreadcrumbs {
  children?: React.ReactElement<IBreadcrumbItem>[];
}

export const Breadcrumbs: FC<IBreadcrumbs> = ({ children }) => {
  return (
    <StyledBreadcrumbs>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child) || child === undefined) return null;
        return React.cloneElement<IBreadcrumbItem>(child, {
          first: idx === 0,
        });
      })}
    </StyledBreadcrumbs>
  );
};
