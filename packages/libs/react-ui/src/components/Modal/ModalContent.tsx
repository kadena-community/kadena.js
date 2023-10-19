'use client';

import { containerClass } from '@components/Card/Card.css';
import { SystemIcon } from '@components/Icon';
import { Heading } from '@components/Typography';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useContext } from 'react';
import { Overlay, useDialog, useModalOverlay } from 'react-aria';
import { ModalContext } from './Modal.context';
import {
  closeButtonClass,
  overlayClass,
  titleWrapperClass,
  underlayClass,
} from './Modal.css';

export interface IModalContentProps {
  children: React.ReactNode;
  title?: string;
}

export const ModalContent: FC<IModalContentProps> = ({ children, title }) => {
  const { state } = useContext(ModalContext);
  const modalRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const { dialogProps, titleProps } = useDialog({}, dialogRef);
  const { modalProps, underlayProps } = useModalOverlay({}, state, modalRef);

  if (!state || !state.isOpen) return null;

  return (
    <Overlay>
      <div onClick={state.close} className={underlayClass} {...underlayProps}>
        <div {...modalProps} ref={modalRef}>
          <div
            {...dialogProps}
            ref={dialogRef}
            className={classNames(containerClass, overlayClass)}
          >
            <button
              className={closeButtonClass}
              onClick={state.close}
              title="Close modal"
            >
              Close
              <SystemIcon.Close />
            </button>

            {title && (
              <div className={titleWrapperClass}>
                <Heading as="h3" {...titleProps}>
                  {title}
                </Heading>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  );
};
