import { Card } from '../Card/Card';
import { SystemIcon } from '../Icons';
import { Heading } from '../Typography';

import {
  background,
  closeButton,
  modal,
  titleWrapper,
  wrapper,
} from './Modal.css';
import { useModal } from './ModalProvider';

import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
  title?: string;
}

export const Modal: FC<IModalProps> = ({ children, title }) => {
  const { clearModal } = useModal();
  return (
    <>
      <button
        data-cy="modal-background"
        className={background}
        onClick={clearModal}
      />
      <div className={wrapper} data-cy="modal">
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
    </>
  );
};
