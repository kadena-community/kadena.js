'use client';

import type { FC } from 'react';
import React from 'react';

import type { AriaDialogProps, AriaModalOverlayProps } from 'react-aria';
import { Overlay, useModalOverlay } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { Dialog } from './Dialog';
import { underlayClass } from './Modal.css';

export interface IModalProps
  extends AriaModalOverlayProps,
    Omit<OverlayTriggerState, 'open' | 'close' | 'toggle'>,
    AriaDialogProps {
  children: React.ReactNode;
  title?: string;
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
}

export const Modal: FC<IModalProps> = ({
  title,
  children,
  isOpen,
  setOpen,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  open = () => setOpen(true),
  close = () => setOpen(false),
  toggle = () => setOpen(!isOpen),
  ...dialogProps
}) => {
  const state = {
    isOpen,
    setOpen,
    open,
    close,
    toggle,
  };
  const modalRef = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable, isKeyboardDismissDisabled },
    state,
    modalRef,
  );

  if (!state.isOpen) return null;

  return (
    <Overlay>
      <div {...underlayProps} className={underlayClass}>
        <div {...modalProps} ref={modalRef}>
          <Dialog
            {...dialogProps}
            title={title}
            onClose={isDismissable ? close : undefined}
          >
            {children}
          </Dialog>
        </div>
      </div>
    </Overlay>
  );
};
