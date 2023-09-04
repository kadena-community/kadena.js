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
import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
  title?: string;
}

export const Modal: FC<IModalProps> = ({ children, title }) => {
  const { clearModal } = useModal();
  return (
    <>
      <FocusTrap
        focusTrapOptions={{
          fallbackFocus: '[data-cy="modal-background"]',
        }}
      >
        <div>
          <button
            data-cy="modal-background"
            className={background}
            onClick={clearModal}
          />
          <div className={wrapper} data-cy="modal" data-testid="kda-modal">
            <section className={modal}>
              <Card fullWidth>
                <div className={titleWrapper}>
                  <Heading as="h2">{title}</Heading>
                </div>

                <button
                  className={closeButton}
                  onClick={clearModal}
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
    </>
  );
};
