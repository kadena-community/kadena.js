import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { Stack } from './../../../../components';
import { useLayout } from './../LayoutProvider';

export const HeaderContent: FC<PropsWithChildren> = ({ children }) => {
  const { headerContentRef } = useLayout();

  if (!headerContentRef || React.Children.count(children) === 0) return null;

  return createPortal(<Stack>{children}</Stack>, headerContentRef);
};
