import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { IBreadcrumbItem } from '.';
import { BreadcrumbItem } from '.';
import type { ProductIcons } from '../ProductIcons';
import { StyledBreadcrumbs } from './styles';

export interface IBreadcrumbs {
  children?: FunctionComponentElement<IBreadcrumbItem>[];
  icon?: (typeof ProductIcons)[keyof typeof ProductIcons];
}

export const Breadcrumbs: FC<IBreadcrumbs> = ({ children, icon }) => {
  return (
    <StyledBreadcrumbs>
      {React.Children.map(children, (child, idx) => {
        if (child === undefined || child.type !== BreadcrumbItem) {
          throw new Error(
            `${child?.type} is not a valid child for Breadcrumbs`,
          );
        }

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
