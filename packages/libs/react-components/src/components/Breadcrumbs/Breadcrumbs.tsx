import { ProcuctIcons } from '../ProductIcons';

import { StyledBreadcrumbs } from './styles';
import { BreadcrumbItem, IBreadcrumbItem } from '.';

import React, { FC, FunctionComponentElement } from 'react';

export interface IBreadcrumbs {
  children?: FunctionComponentElement<IBreadcrumbItem>[];
  icon?: typeof ProcuctIcons[keyof typeof ProcuctIcons];
}

export const Breadcrumbs: FC<IBreadcrumbs> = ({ children, icon }) => {
  return (
    <StyledBreadcrumbs>
      {React.Children.map(children, (child, idx) => {
        if (
          child === undefined ||
          child?.type?.displayName !== BreadcrumbItem?.displayName
        )
          return null;

        if (idx === 0) {
          return React.cloneElement<IBreadcrumbItem>(child, { icon });
        }

        // eslint-disable-next-line
        const { icon: _, ...props } = child.props;
        return React.cloneElement<IBreadcrumbItem>(child, { ...props });
      })}
    </StyledBreadcrumbs>
  );
};
