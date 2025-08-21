import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLayout } from '../LayoutProvider';
import { rightAsideClass } from './style.css';

interface IRightAside extends PropsWithChildren {
  isOpen: boolean;
  onClose?: () => void;
}

export const RightAside: FC<IRightAside> = ({
  children,
  isOpen,
  onClose = () => {},
}) => {
  const { rightAsideRef, setRightAsideOnClose } = useLayout();

  useEffect(() => {
    setRightAsideOnClose(onClose);
  }, [onClose]);

  if (!isOpen || !rightAsideRef) return null;

  return createPortal(
    <section className={rightAsideClass}>{children}</section>,
    rightAsideRef,
  );
};
