import { useNetwork } from '@/hooks/networks';
import type { IBreadcrumbsProps } from '@kadena/kode-ui';
import { Badge } from '@kadena/kode-ui';
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
  const { activeNetwork } = useNetwork();

  return (
    <SideBarBreadcrumbsUI
      {...props}
      badge={
        <Badge size="sm" style="highContrast">{`${activeNetwork?.name}`}</Badge>
      }
    >
      <SideBarBreadcrumbsItem component={Link} href="/">
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
