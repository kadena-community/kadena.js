import type { IBreadcrumbsProps } from '@kadena/kode-ui';
import {
  SideBarBreadcrumbsItem,
  SideBarBreadcrumbs as SideBarBreadcrumbsUI,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

export const SideBarBreadcrumbs: FC<IBreadcrumbsProps> = ({
  children,
  ...props
}) => {
  return (
    <SideBarBreadcrumbsUI {...props}>
      <SideBarBreadcrumbsItem component={Link} href="/dashboard">
        Dashboard
      </SideBarBreadcrumbsItem>
      {
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          return React.cloneElement(child, { ...child.props, component: Link });
        }) as any
      }
    </SideBarBreadcrumbsUI>
  );
};
