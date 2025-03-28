import type { FC } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import type { IBreadcrumbsProps } from './../../../../components';
import { useLayout } from './../LayoutProvider';

export const TopBanner: FC<IBreadcrumbsProps> = ({ children, ...props }) => {
  const { topbannerRef } = useLayout();

  if (!topbannerRef || React.Children.count(children) === 0) return null;

  return createPortal(children, topbannerRef);
};
