import type { FC } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import type { IBreadcrumbsProps } from './../../../../components';
import { Breadcrumbs } from './../../../../components';
import { useLayout } from './../LayoutProvider';

export const SideBarBreadcrumbs: FC<IBreadcrumbsProps> = ({
  children,
  ...props
}) => {
  const { breadcrumbsRef } = useLayout();

  if (!breadcrumbsRef || React.Children.count(children) === 0) return null;

  return createPortal(
    <Breadcrumbs {...props}>{children}</Breadcrumbs>,

    breadcrumbsRef,
  );
};
