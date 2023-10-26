'use client';

import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaModalOverlayProps } from 'react-aria';
import { Overlay, useModalOverlay } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { underlayClass } from './Modal.css';

export interface IModalProps
  extends Omit<OverlayTriggerState, 'open' | 'close' | 'toggle'>,
    AriaModalOverlayProps {
  children: ReactNode;
}

export const Modal: FC<IModalProps> = ({
  children,
  setOpen,
  isOpen,
  isDismissable = true,
  isKeyboardDismissDisabled,
}) => {
  const ref = React.useRef(null);
  const state = {
    isOpen,
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen),
  };
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable, isKeyboardDismissDisabled },
    state,
    ref,
  );

  if (!state.isOpen) return null;

  return (
    <Overlay>
      <div {...underlayProps} className={underlayClass}>
        <div {...modalProps} ref={ref}>
          {React.cloneElement(children(state.close))}
        </div>
      </div>
    </Overlay>
  );
};
