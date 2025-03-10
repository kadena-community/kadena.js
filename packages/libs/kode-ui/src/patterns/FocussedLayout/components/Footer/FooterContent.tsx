import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { Stack } from './../../../../components';
import { useLayout } from './../LayoutProvider';

export const FooterContent: FC<PropsWithChildren> = ({ children }) => {
  const { footerContentRef } = useLayout();

  console.log(footerContentRef);
  if (!footerContentRef || React.Children.count(children) === 0) return <></>;

  return createPortal(<Stack>{children}</Stack>, footerContentRef);
};
