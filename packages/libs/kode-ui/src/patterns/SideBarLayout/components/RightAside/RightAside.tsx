import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLayout } from '../LayoutProvider';
import { rightAsideClass } from './style.css';

export interface iRightAside extends PropsWithChildren {
  isOpen: boolean;
}

export const RightAside: FC<iRightAside> = ({ children, isOpen }) => {
  const {
    rightAsideRef,
    location,
    setIsRightAsideExpanded,
    isRightAsideExpanded,
  } = useLayout();

  useEffect(() => {
    if (!isRightAsideExpanded) return;
    setIsRightAsideExpanded(false);
  }, [location?.url]);

  if (!isOpen || !rightAsideRef) return null;

  return createPortal(
    <section className={rightAsideClass}>{children}</section>,
    rightAsideRef,
  );
};
