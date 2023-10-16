'use client';

import {
  background,
  closeButton,
  modal,
  titleWrapper,
  wrapper,
} from './Modal.css';
import { useModal } from './useModal';

import { Card } from '@components/Card';
import { SystemIcon } from '@components/Icon';
import { Heading } from '@components/Typography/Heading/Heading';
import FocusTrap from 'focus-trap-react';
import type { FC } from 'react';
import React from 'react';

export interface IModalProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export const Modal: FC<IModalProps> = ({ children, title, onClose }) => {
  const { clearModal } = useModal();

  function handleCloseModal(): void {
    onClose?.();
    clearModal();
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        fallbackFocus: '[data-cy="modal-background"]',
      }}
    >
      <div>
        <button
          data-cy="modal-background"
          className={background}
          onClick={handleCloseModal}
        />
        <div className={wrapper} data-cy="modal" data-testid="kda-modal">
          <section className={modal}>
            <Card fullWidth>
              <div className={titleWrapper}>
                <Heading as="h2">{title}</Heading>
              </div>

              <button
                className={closeButton}
                onClick={handleCloseModal}
                title="Close modal"
              >
                Close
                <SystemIcon.Close />
              </button>

              {children}
            </Card>
          </section>
        </div>
      </div>
    </FocusTrap>
  );
};
