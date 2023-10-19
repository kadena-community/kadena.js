import { containerClass } from '@components/Card/Card.css';
import { SystemIcon } from '@components/Icon';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { forwardRef } from 'react';
import { closeButtonClass, overlayClass, underlayClass } from './Modal.css';

export interface IModalContentProps {
  children: React.ReactNode;
}

export const ModalContent: FC<IModalContentProps> = forwardRef(
  function ModalContent({ children, ...props }, forwardedRef) {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={underlayClass} />
        <DialogPrimitive.Content
          {...props}
          ref={forwardedRef}
          className={classNames(containerClass, overlayClass)}
        >
          {children}
          <DialogPrimitive.Close
            aria-label="Close"
            className={closeButtonClass}
          >
            <SystemIcon.Close size="md" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
