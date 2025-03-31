import { useCardLayout } from '@/App/LayoutLandingPage/components/CardLayoutProvider';
import { CardFooterGroup } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export const CardFooterContent: FC<PropsWithChildren> = ({ children }) => {
  const { footerContentRef } = useCardLayout();

  if (!footerContentRef || React.Children.count(children) === 0) return null;

  return createPortal(
    <CardFooterGroup>{children}</CardFooterGroup>,
    footerContentRef,
  );
};
