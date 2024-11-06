import { IBreadcrumbsProps } from '@kadena/kode-ui';
import { SideBarBreadcrumbs } from '@kadena/kode-ui/patterns';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({ children, ...props }) => {
  return (
    <SideBarBreadcrumbs {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return React.cloneElement(child, { ...child.props, component: Link });
      })}
    </SideBarBreadcrumbs>
  );
};
