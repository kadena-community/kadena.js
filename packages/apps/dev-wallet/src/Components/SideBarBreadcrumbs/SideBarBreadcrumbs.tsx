import { IBreadcrumbsProps } from '@kadena/kode-ui';
import { SideBarBreadcrumbs as SideBarBreadcrumbsUI } from '@kadena/kode-ui/patterns';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const SideBarBreadcrumbs: FC<IBreadcrumbsProps> = ({
  children,
  ...props
}) => {
  return (
    <SideBarBreadcrumbsUI {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return React.cloneElement(child, { ...child.props, component: Link });
      })}
    </SideBarBreadcrumbsUI>
  );
};
