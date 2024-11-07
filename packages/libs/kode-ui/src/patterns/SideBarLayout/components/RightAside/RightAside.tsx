import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { useLayout } from '../LayoutProvider';
import { rightAsideClass } from './style.css';

export interface iRightAside extends PropsWithChildren {
  isOpen: boolean;
}

export const RightAside: FC<iRightAside> = ({ children, isOpen }) => {
  const { rightAsideRef } = useLayout();

  if (!isOpen || !rightAsideRef) return null;

  return createPortal(
    <section className={rightAsideClass}>{children}</section>,
    rightAsideRef,
  );
};
