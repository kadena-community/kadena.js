import { ProductIcon } from '../Icons';

import { containerClass } from './Breadcrumbs.css';
import { BreadcrumbsItem, IBreadcrumbItemProps } from './BreadcrumbsItem';

import React, { FC, FunctionComponentElement } from 'react';

export interface IBreadcrumbsProps {
  children?: FunctionComponentElement<IBreadcrumbItemProps>[];
  icon?: typeof ProductIcon[keyof typeof ProductIcon];
}

export const BreadcrumbsContainer: FC<IBreadcrumbsProps> = ({
  children,
  icon,
}) => {
  return (
    <nav>
      <ul className={containerClass}>
        {React.Children.map(children, (child, idx) => {
          if (child === undefined || child.type !== BreadcrumbsItem) {
            throw new Error(
              `${child?.type} is not a valid child for Breadcrumbs`,
            );
          }

          if (idx === 0) {
            return React.cloneElement<IBreadcrumbItemProps>(child, { icon });
          }

          // eslint-disable-next-line
          const { icon: _, ...props } = child.props;
          return React.cloneElement<IBreadcrumbItemProps>(child, { ...props });
        })}
      </ul>
    </nav>
  );
};
